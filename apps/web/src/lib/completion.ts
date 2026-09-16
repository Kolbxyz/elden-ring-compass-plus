// Completion model — the data behind the Overview "how close am I to 100%?" tracker.
//
// The denominator is CURATED, not the raw catalog (see docs/projects/overview-completion-tracker.md):
//  - Weapons collapse their affinity variants (Bleed Dagger ← Dagger via Ash of War) to one base.
//  - Armor collapses its "(Altered)" variants (Boc the tailor) to one base.
//  - Talismans (+1/+2 are separate world pickups), spells, spirit ashes, ashes of war and gestures
//    count every row — each is a distinct collectible, not a transform of another.
// `[ERROR]Type N` placeholder rows are already filtered out at the catalog source
// (inventory-catalog.ts), so the counts here are clean.
import { useMemo } from 'react';

import { ARMOR } from '@elden-ring-compass/data';
import { itemIconUrl } from '@elden-ring-compass/data/images';

import { useSelectedSlot } from '@/stores/slot-selection-store';
import { goodsByName } from './game-data';
import { type InventoryRow, useInventoryTables } from './inventory-catalog';
import { Slot } from './save-dto';
import { eventsDbView } from './vm/events';
import { equipmentDbView } from './vm/equipement';
import { inventoryDbView } from './vm/inventory';

/** One progress row in the breakdown. `categorySlug` deep-links into the matching inventory table. */
export type CompletionCategory = {
  key: string;
  label: string;
  owned: number;
  total: number;
  pct: number;
  /** `/inventory/$category` slug to jump to (Missing-filtered), when this maps to a table. */
  categorySlug?: string;
  /** A non-inventory destination (bosses / graces routes). */
  to?: string;
};

/** A small "collect them all" set, rendered as a trophy chip. */
export type Milestone = {
  key: string;
  label: string;
  owned: number;
  total: number;
};

export type CompletionModel = {
  hasSave: boolean;
  overallPct: number;
  categories: CompletionCategory[];
  milestones: Milestone[];
};

const pct = (owned: number, total: number) => (total > 0 ? Math.round((owned / total) * 100) : 0);

/** Group rows where several catalog rows are transforms of one collectible (weapons, armor). */
function collapse(
  items: ReadonlyArray<InventoryRow>,
  keyOf: (row: InventoryRow) => string | number,
) {
  const anyOwned = new Map<string | number, boolean>();
  for (const it of items) {
    const k = keyOf(it);
    anyOwned.set(k, (anyOwned.get(k) ?? false) || it.quantity > 0);
  }
  return {
    total: anyOwned.size,
    owned: [...anyOwned.values()].filter(Boolean).length,
  };
}

const armorIconById = new Map(ARMOR.map((a) => [a.id, a.icon]));

/** Icon url for the character's equipped helm (the completion ring's center), or undefined if bareheaded. */
export function equippedHelmIconUrl(slot?: Readonly<Slot>): string | undefined {
  if (!slot) return undefined;
  const headId = equipmentDbView(slot).head.id;
  if (!headId) return undefined;
  const icon = armorIconById.get(headId);
  return icon != null ? (itemIconUrl(icon) ?? undefined) : undefined;
}

export const GREAT_RUNES = [
  { name: "Godrick's Great Rune", itemIds: [191, 8148], bossFlagId: 10000800 },
  { name: "Radahn's Great Rune", itemIds: [192, 8149], bossFlagId: 1252380800 },
  { name: "Morgott's Great Rune", itemIds: [193, 8150], bossFlagId: 11000800 },
  { name: "Rykard's Great Rune", itemIds: [194, 8151], bossFlagId: 16000800 },
  { name: "Mohg's Great Rune", itemIds: [195, 8152], bossFlagId: 12050800 },
  { name: "Malenia's Great Rune", itemIds: [196, 8153], bossFlagId: 15000800 },
  { name: "Great Rune of the Unborn", itemIds: [10080], bossFlagId: 14000800 },
] as const;

export const REMEMBRANCES = [
  { name: 'Remembrance of the Grafted', goodId: 2950, bossFlagId: 10000800 },
  { name: 'Remembrance of the Starscourge', goodId: 2951, bossFlagId: 1252380800 },
  { name: 'Remembrance of the Omen King', goodId: 2952, bossFlagId: 11000800 },
  { name: 'Remembrance of the Blasphemous', goodId: 2953, bossFlagId: 16000800 },
  { name: 'Remembrance of the Rot Goddess', goodId: 2954, bossFlagId: 15000800 },
  { name: 'Remembrance of the Blood Lord', goodId: 2955, bossFlagId: 12050800 },
  { name: 'Remembrance of the Black Blade', goodId: 2956, bossFlagId: 13000800 },
  { name: 'Remembrance of Hoarah Loux', goodId: 2957, bossFlagId: 11050800 },
  { name: 'Remembrance of the Dragonlord', goodId: 2958, bossFlagId: 13000830 },
  { name: 'Remembrance of the Full Moon Queen', goodId: 2959, bossFlagId: 14000800 },
  { name: 'Remembrance of the Lichdragon', goodId: 2960, bossFlagId: 12030850 },
  { name: 'Remembrance of the Fire Giant', goodId: 2961, bossFlagId: 1052520800 },
  { name: 'Remembrance of the Regal Ancestor', goodId: 2962, bossFlagId: 12090800 },
  { name: 'Elden Remembrance', goodId: 2963, bossFlagId: 19000800 },
  { name: 'Remembrance of the Naturalborn', goodId: 2964, bossFlagId: 12040800 },
] as const;

export function useCompletion(): CompletionModel {
  const slot = useSelectedSlot();
  const tables = useInventoryTables();

  return useMemo(() => {
    const events = eventsDbView(slot);
    const bosses = events.filter((e) => e.type === 'boss');
    const graces = events.filter((e) => e.type === 'grace');

    // Weapons: collapse affinity variants by their shared base id (affinityIndex 0 sibling).
    const weapons = collapse(
      tables.armaments.items,
      (r) => (r as { baseId?: number }).baseId ?? r.id,
    );
    // Armor: collapse "(Altered)" tailor variants by base name.
    const armor = collapse(tables.armor.items, (r) => r.name.replace(/\s*\(Altered\)\s*$/, ''));

    // Gestures aren't inventory items (no quantity) — they live in the save's 64-slot gesture
    // unlock table (`0` / `0xFFFFFFFE` mark empty slots), so count distinct learned gestures there.
    const ownedGestures = slot
      ? new Set(slot.gestures.filter((g) => g !== 0 && g !== 0xfffffffe)).size
      : 0;

    const cat = (
      key: string,
      label: string,
      owned: number,
      total: number,
      extra?: Partial<CompletionCategory>,
    ): CompletionCategory => ({
      key,
      label,
      owned,
      total,
      pct: pct(owned, total),
      ...extra,
    });

    // `ownedCount` on the inventory tables already counts distinct rows with quantity > 0.
    const categories: CompletionCategory[] = [
      cat('bosses', 'Bosses', bosses.filter((e) => e.on).length, bosses.length, { to: '/bosses' }),
      cat('graces', 'Sites of Grace', graces.filter((e) => e.on).length, graces.length),
      cat('weapons', 'Weapons', weapons.owned, weapons.total, {
        categorySlug: 'weapons-shields',
      }),
      cat('armor', 'Armor', armor.owned, armor.total, {
        categorySlug: 'armor',
      }),
      cat('talismans', 'Talismans', tables.talismans.ownedCount, tables.talismans.items.length, {
        categorySlug: 'talismans',
      }),
      cat(
        'spells',
        'Sorceries & Incantations',
        tables.spells.ownedCount,
        tables.spells.items.length,
        {
          categorySlug: 'spells',
        },
      ),
      cat('spirits', 'Spirit Ashes', tables.spirits.ownedCount, tables.spirits.items.length, {
        categorySlug: 'spirit-ashes',
      }),
      cat('ashes', 'Ashes of War', tables.ashes.ownedCount, tables.ashes.items.length, {
        categorySlug: 'ashes-of-war',
      }),
      cat('gestures', 'Gestures', ownedGestures, tables.gestures.items.length, {
        categorySlug: 'gestures',
      }),
    ];

    // Overall = equal-weight mean of category percentages (so weapons' large count doesn't dominate).
    const overallPct = categories.length
      ? Math.round(categories.reduce((s, c) => s + c.pct, 0) / categories.length)
      : 0;

    const ownedIds = new Set<number>();
    const inventoryQuantityById = new Map<number, number>();
    if (slot)
      for (const it of inventoryDbView(slot).items) {
        inventoryQuantityById.set(it.item_id, it.quantity);
        if (it.quantity > 0) ownedIds.add(it.item_id);
      }

    const defeatedBossFlags = new Set(bosses.filter((e) => e.on).map((e) => e.id));

    const ownedGreatRunes = GREAT_RUNES.filter(
      (r) =>
        r.itemIds.some((id) => ownedIds.has(id)) ||
        defeatedBossFlags.has(r.bossFlagId) ||
        (r.name.includes('Radahn') && defeatedBossFlags.has(310)),
    ).length;

    const ownedRemembrances = REMEMBRANCES.filter(
      (r) =>
        ownedIds.has(r.goodId) ||
        defeatedBossFlags.has(r.bossFlagId) ||
        (r.name.includes('Starscourge') && defeatedBossFlags.has(310)) ||
        (r.name.includes('Elden') && defeatedBossFlags.has(19000810)),
    ).length;

    const crimsonFlaskPotency = (() => {
      for (let i = 12; i >= 1; i--) {
        const item = goodsByName.get(`Flask of Crimson Tears +${i}`);
        if (item && ownedIds.has(item.id)) return i;
      }
      return 0;
    })();
    const sacredTearGood = goodsByName.get('Sacred Tear');
    const unusedSacredTears = sacredTearGood ? (inventoryQuantityById.get(sacredTearGood.id) ?? 0) : 0;
    const sacredTearsFound = Math.min(12, crimsonFlaskPotency + unusedSacredTears);

    const milestones: Milestone[] = [
      {
        key: 'greatRunes',
        label: 'Great Runes',
        total: GREAT_RUNES.length,
        owned: ownedGreatRunes,
      },
      {
        key: 'remembrances',
        label: 'Remembrances',
        total: REMEMBRANCES.length,
        owned: ownedRemembrances,
      },
      {
        key: 'sacredTears',
        label: 'Sacred Tears',
        total: 12,
        owned: sacredTearsFound,
      },
    ];

    return { hasSave: !!slot, overallPct, categories, milestones };
  }, [slot, tables]);
}
