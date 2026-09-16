# Elden Ring Complete Quest Engine, State Machine & Interlinkages

This document provides a comprehensive technical and narrative breakdown of Elden Ring's questlines, their underlying event-flag architecture, world-progression gates, mutual exclusions, failure conditions, and step-by-step resolution pathways.

---

## 1. The Underlying Quest Engine Architecture

Unlike conventional RPGs with quest logs and quest journal entries, FromSoftware games (Dark Souls, Bloodborne, Elden Ring) model all questlines through a **distributed event flag state machine**:

1. **Named Event Flags (`EFID_Talk_NPC{nnn}`)**:
   - Each questline NPC has a dedicated block of event flags assigned in the game's event parameter database (`regulation.bin` / EMEVD scripts).
   - Flags follow an analytical offset pattern resolved via `eventflag_bst.txt`.
   - Each NPC block generally contains:
     - **Status Sub-block**: `Alive`, `Hostile (Absolvable at Church of Vows)`, `Hostile (Permanent)`, `Dead`.
     - **Talk / Checkpoint Sub-block**: Progressive monotonic bits indicating conversations completed, key items delivered, and geographic relocations.
2. **EMEVD Script Checks**:
   - Map event scripts (`m10_...` to `m60_...`) check these flags at every world load / grace rest.
   - NPC spawner scripts evaluate boolean expressions (e.g. `FlagEnabled(CHECKPOINT_A) && !FlagEnabled(GATE_B) && FlagEnabled(ALIVE)`). If true, the NPC asset is spawned at location X; otherwise, it is disabled or placed at location Y.
3. **World State Gates (The Master Chronology)**:
   - Several global flags act as overarching timeline shifters that simultaneously advance, alter, or permanently terminate multiple NPC questlines.

---

## 2. The 7 World Progression Gates (Timeline Shifters)

Every NPC questline runs in parallel against 7 global milestones:

```
[Gate 1: Stormveil / Godrick]
       │
       ▼
[Gate 2: Altus Plateau Reached] ──► Triggers Radahn Festival, moves Corhyn/Rya/Boc
       │
       ▼
[Gate 3: Starscourge Radahn Slain] ──► Opens Nokron, frees Jerren, unlocks Ranni phase 2
       │
       ▼
[Gate 4: Fingerslayer Blade Given] ──► Ranni departs, Seluvis dies, Pidia killed
       │
       ▼
[Gate 5: Morgott Slain (Leyndell)] ──► Rold Medallion, Mountaintops open, Shabriri spawns
       │
       ▼
[Gate 6: Forge of the Giants Burned] ──► Point of No Return 1: Erdtree burning, Farum Azula
       │
       ▼
[Gate 7: Maliketh Slain (Destined Death)] ──► Point of No Return 2: Leyndell becomes Ashen Capital
```

### Critical Points of No Return
- **Altus Plateau Entry**: If you rest at any grace on Altus Plateau before visiting Redmane Castle, the Radahn Festival activates immediately, bypassing the normal Redmane Castle dungeon phase (Crucible Knight + Misbegotten Warrior boss fight disappears until after Radahn is slain and you talk to Jerren to reset the castle).
- **Forge of the Giants (Burning the Erdtree)**: Permanently advances Roundtable Hold toward ruin. Melina leaves or sacrifices herself.
- **Maliketh Defeat (Capital of Ash)**: Permanently buries Royal Capital Leyndell in ash. Locks out:
  - Bolt of Gransax (Legendary Armament)
  - Leyndell Seedbed Curses (Dung Eater quest)
  - Corhyn & Goldmask Leyndell dialogue / Law of Regression puzzle
  - Nepheli / Kenneth / Gostoc throne room transition if prerequisites were unmet.

---

## 3. Comprehensive NPC Questlines & Step-by-Step Links

---

### Group A: The Major Ending Hubs

#### 1. Ranni the Witch (Age of Stars Ending)
*The most interconnected questline in the game, tying together Blaidd, Iji, Seluvis, Rogier, Sellen, Jerren, Radahn, and Astel.*

- **Step 1: Church of Elleh** — At night, "Renna" gives the Spirit Calling Bell and Lone Wolf Ashes. *(Skipping this moves the bell to Twin Maiden Husks once Roundtable is visited).*
- **Step 2: Carian Manor & Ranni's Rise** — Defeat Royal Knight Loretta. Ascend Ranni's Rise in Three Sisters. Pledge service to Ranni. Speak to projections of Iji, Blaidd, and Seluvis downstairs, then speak to Ranni again to dispel the barrier.
- **Step 3: The Nokron Blockade** — Blaidd is waiting in Siofra River. He notes they cannot find a way up to Nokron.
- **Step 4: Seluvis & Sellen Connection** — Speak to Seluvis at his rise; get Seluvis's Introduction. Take it to Sorceress Sellen in Waypoint Ruins. Sellen reveals that Radahn halted the stars, freezing the Carian royal fate.
- **Step 5: The Radahn Festival** — Defeat Starscourge Radahn at Redmane Castle with Blaidd and Alexander. The falling star strikes Limgrave, opening the entrance to Nokron.
- **Step 6: Nokron & The Fingerslayer Blade** — Enter Nokron from Mistwood. Navigate to Night's Sacred Ground and loot the **Fingerslayer Blade** from the chest below the giant skeleton throne.
- **Step 7: Deliver the Blade & Ranni's Departure** — Return to Ranni's Rise. Give the Fingerslayer Blade to Ranni. She rewards you with the **Carian Inverted Statue** (used in Carian Study Hall for the Cursemark of Death).
  - *Trigger*: Seluvis dies immediately.
  - *Trigger*: Renna's Rise opens.
- **Step 8: Ainsel River & Miniature Ranni** — Climb Renna's Rise and take the waygate to Ainsel River Main. Pick up the **Miniature Ranni** doll. Rest at the grace and choose "Talk to miniature Ranni" 3 times until she responds. She orders you to slay the Baleful Shadow.
- **Step 9: Baleful Shadow & Discarded Palace Key** — Travel through Nokstella to the Lake of Rot elevator. Defeat the Baleful Shadow (an invader resembling Blaidd). Ranni thanks you and rewards you with the **Discarded Palace Key**.
- **Step 10: Dark Moon Ring** — Take the key to Raya Lucaria Grand Library. Unlock the chest next to Rennala to obtain the **Dark Moon Ring**.
- **Step 11: Lake of Rot & Astel** — Cross Lake of Rot, descend the Grand Cloister coffin, and defeat **Astel, Naturalborn of the Void**.
- **Step 12: Moonlight Altar & Cathedral of Manus Celes** — Ride the elevator behind Astel up to Moonlight Altar. Avoid or slay Glintstone Dragon Adula. Drop into the cavern below the Cathedral of Manus Celes.
- **Step 13: The Ring & Moonlight Greatsword** — Place the Dark Moon Ring on Ranni's doll finger. Ranni appears in her true empyrean form, pledges herself to you, and bestows the **Dark Moon Greatsword**.
- **Step 14: Blaidd & Iji Aftermath**:
  - Return to Ranni's Rise to find Blaidd driven mad by the Two Fingers; defeat him for Blaidd's Armor and Royal Greatsword.
  - Speak with War Counselor Iji about Blaidd. Rest at grace; Iji is slain by Black Knife Assassins, his body surrounded by Black Flame.

---

#### 2. Fia, Deathbed Companion (Age of the Duskborn Ending)
*Linked to: Sorcerer Rogier, D, Hunter of the Dead, D's Twin Brother, Cursemark of Death, Lichdragon Fortissax.*

- **Step 1: Roundtable Hold Hugs** — Receive Baldachin's Blessing.
- **Step 2: Weathered Dagger** — After reaching Altus Plateau (or triggering the Radahn Festival), talk to Fia in private. She gives you the **Weathered Dagger**.
- **Step 3: Hand Dagger to D** — Give the dagger to D, Hunter of the Dead in Roundtable Hold.
- **Step 4: Murder in the Roundtable** — Rest at the Roundtable grace. The door past Master Hewg opens. Inside, D lies dead and Fia stands over him, taking his armor. Fia vanishes.
- **Step 5: Cursemark of Death** — In Carian Study Hall, use Ranni's Carian Inverted Statue to reach the Divine Tower of Liurnia. Loot the **Cursemark of Death** from Ranni's discarded empyrean body.
- **Step 6: Deeproot Depths** — Reach Deeproot Depths (via the coffin after Valiant Gargoyles in Nokron or through Subterranean Shunning-Grounds).
- **Step 7: Fia's Champions** — At Prince of Death's Throne, defeat Fia's Champions (Rogier, Lionel, and generic champions).
- **Step 8: Offer Cursemark** — Speak to Fia. Ask to be held. Give her the Cursemark of Death. Exhaust dialogue and reload the area until she falls asleep.
- **Step 9: Deathbed Dream & Fortissax** — Interact with Fia to enter the Deathbed Dream. Slay **Lichdragon Fortissax**.
- **Step 10: Mending Rune of the Death-Prince** — On exiting the dream, collect the **Mending Rune of the Death-Prince** from Fia's body.
- **Step 11: D's Twin Brother Interaction**:
  - If you gave the Twinned Armor to D's brother outside the Valiant Gargoyle arena, he arrives at Fia's body and executes her corpse. Reload the area to obtain the Twinned Armor back along with the Inseparable Sword.

---

#### 3. Brother Corhyn & Goldmask (Age of Order Ending)
*Linked to: Miriel (Incantations), Leyndell Capital, Law of Regression puzzle.*

- **Step 1: Roundtable Hold Departure** — Corhyn announces he is leaving Roundtable Hold to seek the noble Goldmask once you reach Altus Plateau.
- **Step 2: Altus Plateau Road** — Find Corhyn on the road north of Altus Highway Junction. He has not found Goldmask yet.
- **Step 3: Forest-Spanning Greatbridge** — Find Goldmask standing silently at the broken north end of the Forest-Spanning Greatbridge.
- **Step 4: Reunited** — Return to Corhyn and tell him Goldmask's location. Return to Goldmask; Corhyn is now standing beside him as his scribe.
- **Step 5: Leyndell Colosseum** — After gaining entry to Leyndell, find Corhyn and Goldmask overlooking the Erdtree Colosseum. Goldmask is pondering the mystery of Radagon.
- **Step 6: The "Radagon is Marika" Puzzle** —
  - Obtain the **Golden Order Principia** book from the rafters of the Erdtree Sanctuary.
  - Give it to Corhyn or Turtle Pope Miriel and learn the **Law of Regression** incantation (requires 37 INT).
  - Walk down the elevator below Erdtree Sanctuary to the statue inscribed "Regression alone reveals secrets".
  - Cast *Law of Regression* while standing on the message. The statue transforms into Queen Marika, revealing the message: *"Radagon is Marika"*.
  - Report this truth to Goldmask. He begins moving his finger; Corhyn expresses awe and sells *Golden Order Totality*.
- **Step 7: Stargazer's Ruins (Mountaintops)** — Find them on the bridge south of Stargazer's Ruins. Corhyn begins doubting Goldmask's calculations.
- **Step 8: Capital of Ash & Mending Rune of Perfect Order** —
  - Defeat Maliketh in Farum Azula to transform Leyndell into the Ashen Capital.
  - Find Goldmask's corpse at the bottom of the cliff below the Colosseum to collect the **Mending Rune of Perfect Order**.
  - Reload to get Goldmask's Armor set. Corhyn is found broken nearby.

---

#### 4. The Loathsome Dung Eater (Blessing of Despair Ending)
*Linked to: Roderika, Blackguard Big Boggart, Subterranean Shunning-Grounds.*

- **Step 1: Red Phantom at Roundtable** — Dung Eater appears as a red phantom in the room past the Twin Maiden Husks after reaching Altus Plateau.
- **Step 2: Show Seedbed Curse** — Find your first **Seedbed Curse** (e.g. Fortified Manor in Leyndell or Volcano Manor). Show it to Dung Eater. He gives you the **Sewer-Gaol Key**.
- **Step 3: Subterranean Shunning-Grounds** — Descend the sewers beneath Leyndell. Unlock his cell in the pipe maze. Choose to tell him "Leave your gaol".
- **Step 4: Moat Warning** — Return to Roundtable Hold; a message in his room says: *"I will defile you next. Come to the outer moat."*
- **Step 5: Outer Moat & Blackguard Boggart** —
  - If Boggart is at the outer moat selling boiled crab, exhaust his dialogue. Reload; Dung Eater attacks. Boggart is tied up and defiled, dropping a Seedbed Curse.
  - Defeat the Dung Eater invader for the **Sword of Milos**.
- **Step 6: Defile Dung Eater** — Return to his cell in the sewers. He is strapped to a chair begging for defilement.
  - *Option A*: Hand him 5 Seedbed Curses. He manifests the **Mending Rune of the Fell Curse**.
  - *Option B (Seluvis Branch)*: Feed him **Seluvis's Potion** instead. He becomes a puppet summon obtainable from Seluvis!

---

#### 5. Hyetta & The Three Fingers (Lord of the Frenzied Flame Ending)
*Linked to: Irina & Edgar (Castle Morne), Vyke.*

- **Step 1: Irina's Tragedy** — Meet Irina at the entrance of Weeping Peninsula. Deliver her letter to Edgar at Castle Morne. Defeat Leonine Misbegotten. Return to find Irina murdered. Edgar swears vengeance.
- **Step 2: Edgar the Revenger** — At Revenger's Shack in Liurnia, Edgar invades as an insane revenger. Slay him to get your first **Shabriri Grape**.
- **Step 3: Hyetta at Church of Irith** — Hyetta appears immediately after Godrick. Give her the 1st Shabriri Grape.
- **Step 4: Purified Ruins** — Give her the 2nd Shabriri Grape found under the wooden floorboard in Purified Ruins.
- **Step 5: Gate Town Bridge** — Give her the 3rd Shabriri Grape. Tell her the truth about what the grapes are (human eyeballs). Rest, speak to her again to hear her resolve.
- **Step 6: Bellum Church & Fingerprint Grape** — Head to Bellum Church. Defeat Festering Fingerprint Vyke near Church of Inhibition to obtain the **Fingerprint Grape**. Give it to Hyetta at Bellum Church.
- **Step 7: Frenzied Flame Proscription** — Beneath Leyndell's Subterranean Shunning-Grounds, defeat Mohg the Omen. Strike the altar to reveal the platforming descent.
- **Step 8: Audience with Three Fingers** — Strip naked before the ominous stone door. Enter to be embraced by the Three Fingers.
- **Step 9: Hyetta's Maidenhood** — Speak to Hyetta outside the door. She becomes your maiden and burns into Frenzied Flame ash, dropping the Frenzied Flame Seal.
  - *Note*: Embracing the Frenzied Flame locks all other endings unless cured using **Miquella's Needle** in Dragonlord Placidusax's arena.

---

### Group B: Major Companion & Character Questlines

#### 6. Millicent & Sage Gowry (Curing the Flame of Frenzy / Malenia Link)
- **Step 1: Gowry's Shack** — Speak to Gowry in eastern Caelid. He tasks you with finding the Unalloyed Gold Needle.
- **Step 2: Commander O'Neil** — Defeat Commander O'Neil in Swamp of Aeonia to get the broken needle. Give it to Gowry.
- **Step 3: Church of the Plague** — Deliver the repaired needle to Millicent dying of scarlet rot in Church of the Plague. Rest at grace; Millicent is healed.
- **Step 4: Gowry's Secrets** — Visit Gowry's Shack. Millicent visits Gowry. Reload to find Gowry back.
- **Step 5: Erdtree-Gazing Hill & Valkyrie's Prosthesis** — Meet Millicent north of Erdtree-Gazing Hill. Travel to The Shaded Castle and retrieve the **Valkyrie's Prosthesis** from a chest guarded by a Cleanrot Knight. Deliver it to Millicent.
- **Step 6: Windmill Village** — Defeat the Godskin Apostle in Dominula, Windmill Village. Rest and speak to Millicent by the windmill.
- **Step 7: Ancient Snow Valley Ruins** — Speak to Millicent at Mountaintops of the Giants. She mentions her relationship to Malenia.
- **Step 8: Haligtree Prayer Room** — Meet Millicent in the Haligtree Prayer Room.
- **Step 9: Ulcerated Tree Spirit Drainage** — Slay the Ulcerated Tree Spirit in the scarlet rot pool near Elphael Inner Wall.
- **Step 10: The Choice (Summon Signs)**:
  - **Gold Sign (Assist Millicent)**: Fight Millicent's 4 sisters. Millicent survives, removes the needle, and dies peacefully of rot. Gives **Rotten Winged Sword Insignia** and returns the **Unalloyed Gold Needle**.
  - **Red Sign (Betray Millicent)**: Slay Millicent immediately. Gives **Millicent's Prosthesis** talisman.
- **Step 11: Miquella's Needle**:
  - Insert the Unalloyed Gold Needle into Malenia's Scarlet Aeonia flower after defeating Malenia. Receive **Miquella's Needle**, which can cleanse the Frenzied Flame in Placidusax's storm arena.

---

#### 7. Iron Fist Alexander (The Warrior Jar)
- **Step 1: Northern Limgrave** — Dislodge him with heavy strikes on his rear near Saintsbridge. Rewards Triumph Delight gesture.
- **Step 2: Gael Tunnel** — Find him behind the rear door inside Gael Tunnel (Caelid entrance).
- **Step 3: Radahn Festival** — Summon him during the Radahn fight at Redmane Castle. Speak to him scavenging warrior corpses after the battle.
- **Step 4: Liurnia Pit (Oil Pot)** — Find him stuck in a pit south of Carian Study Hall. Craft and throw an **Oil Pot** at him, then hit him with heavy attacks to free him.
- **Step 5: Mt. Gelmir Lava Bath** — Find him bathing in magma behind the Magma Wyrm near Seethewater Terminus. He awards the Jar helm.
- **Step 6: Fire Giant Summon** — Available as a summon against the Fire Giant at Forge of the Giants.
- **Step 7: Crumbling Farum Azula** — Find him on the ruins accessible via a Stonesword Key elevator. Engage in an honorable duel to the death. Defeating him rewards **Alexander's Innards** and the top-tier **Shard of Alexander** talisman.
- **Step 8: Legacy in Jarburg** — Deliver Alexander's Innards to **Jar Bairn** in Jarburg to conclude the Jar village quest.

---

#### 8. Nepheli Loux, Kenneth Haight & Gatekeeper Gostoc (Rulers of Limgrave)
*One of the most complex multi-NPC convergent questlines.*

- **Kenneth Haight**:
  1. Found atop ruins in Mistwood begging to reclaim Fort Haight.
  2. Clear Fort Haight of the blood knight commander. Kenneth moves there, knightship deferred because he seeks a true ruler for Limgrave.
- **Nepheli Loux**:
  1. Found in a room before Godrick's arena; available as a summon for Godrick.
  2. At Roundtable Hold, gifts Arsenal Charm.
  3. Village of the Albinaurics: Found beneath the bridge depressed by the slaughter; summons for Omenkiller.
  4. Returns to Roundtable downstairs in despair after being disowned by Gideon Ofnir.
  5. **Seluvis's Potion Threat**: Seluvis tells you to give Nepheli his potion.
     - *Giving potion to Nepheli*: Kills her, turns her into Seluvis's puppet summon (Fails throne quest!).
     - *Giving potion to Gideon*: Disposes of potion safely.
     - *Giving potion to Dung Eater*: Turns Dung Eater into puppet.
  6. **The Stormhawk King**: Visit the Chapel of Anticipation via the Four Belfries. Find the spirit ashes of **The Stormhawk King**. Give them to Nepheli to restore her warrior spirit.
- **Gostoc**:
  1. Opens the gate or side path at Stormveil. If alive, stomps on Godrick's head after defeat.
- **The Convergence**:
  - Once Morgott is defeated and all 3 NPC steps are satisfied, rest at Godrick's grace.
  - Nepheli Loux takes the throne of Stormveil Castle as Lord of Limgrave, with Kenneth Haight standing beside her as adviser and Gostoc reopening his shop selling an **Ancient Dragon Smithing Stone**!

---

#### 9. Sorceress Sellen & Witch-Hunter Jerren
- **Step 1: Waypoint Ruins** — Defeat Mad Pumpkin Head; Sellen becomes your teacher.
- **Step 2: Primeval Glintstone Sorceries**:
  - Find **Comet Azur** on Mt. Gelmir from Primeval Sorcerer Azur.
  - Show it to Sellen. She asks you to find Master Lusat in Sellia Hideaway (Caelid) using the Sellian Sealbreaker.
- **Step 3: Sellen's True Body** — Sellen sends you to Witchbane Ruins in Weeping Peninsula. Her true body is chained. Extract her **Primal Glintstone**.
- **Step 4: Seluvis's Secret Puppet Cellar** — Under ruins near Ranni's Rise, find the hidden cellar behind an illusory floor. Insert Sellen's Primal Glintstone into the spare puppet body.
- **Step 5: Jerren's Hunt** — After Radahn dies, talk to Jerren in Redmane Castle until he leaves. Jerren arrives at Witchbane Ruins over Sellen's dead shell.
- **Step 6: The Grand Choice at Raya Lucaria**:
  - Outside Rennala's library, choose between two summon signs:
  - **Gold Sign (Assist Sellen)**: Defeat Jerren. Sellen takes over the library, offers the Glintstone Kris and Shard Spiral. After resting, she is mutated into a School of Graven Mages, and Rennala returns.
  - **Red Sign (Assist Jerren)**: Defeat Sellen. Jerren gives an Ancient Dragon Smithing Stone and Witch's Glintstone Crown.

---

#### 10. Volcano Manor Assassination Questline
*Ties together Tanith, Rya, Bernahl, Patches, Diallos, and Boggart.*

- **Rya's Recruitment**: Help Rya retrieve her necklace from Boggart in Liurnia. She teleports you to Volcano Manor.
- **Volcano Manor Letters**:
  1. *Target 1: Old Knight Istvan* (Limgrave) — Rewards Scaled Armor set.
  2. *Target 2: Rileigh the Idle* (Altus Plateau) — Rewards Crepus's Vial and Black-Key Bolts.
  3. *Patches' Target: Great Horned Tragoth* (Ruin-Strewn Precipice) — Bull-Goat Armor set.
  4. *Bernahl's Target: Vargram the Raging Wolf & Errant Sorcerer Wilhelm* (Leyndell) — Raging Wolf set.
  5. *Target 3: Juno Hoslow* (Mountaintops of the Giants) — Hoslow's Petal Whip and armor.
- **Rya's Heritage**: Discover the illusory wall in the manor; find the secret snake temple. Rya realizes she is a serpent daughter (Zorayas). Decide to spare her, kill her, or give Tonic of Forgetfulness.
- **Diallos's Redemption**: Diallos leaves Volcano Manor in disgust, moves to Jarburg to become the Potentate, and dies defending the little jars from poachers.
- **Rykard's Fall**: Slay Rykard, Lord of Blasphemy. The manor disperses. Tanith is found devouring Rykard's corpse in the arena. Patches offers Dancer's Castanets from Shaded Castle to snap her out of it.

---

## 4. Master Dependency & Conflict Matrix

| Quest / NPC | Intersecting NPCs / Quests | Hard Blockers & Incompatible Actions |
|---|---|---|
| **Ranni** | Blaidd, Iji, Seluvis, Sellen, Jerren, Radahn | Handing Fingerslayer Blade kills Seluvis instantly. Giving Amber Draught to Ranni angers her (requires Celestial Dew absolution). |
| **Seluvis** | Nepheli, Dung Eater, Gideon, Sellen, Ranni | Dies once Ranni gets Fingerslayer Blade. Potion can only be given to ONE target (Nepheli OR Dung Eater OR Gideon). |
| **Nepheli** | Kenneth Haight, Gostoc, Gideon, Seluvis | Giving Seluvis's potion immediately turns her into a puppet, permanently killing her and failing Limgrave throne quest. |
| **Dung Eater** | Boggart, Seluvis, Roderika | Defiling Dung Eater before Boggart moves to outer moat prevents Boggart's Seedbed curse; feeding Seluvis potion turns Dung Eater into puppet instead of Mending Rune. |
| **Boggart** | Rya, Dung Eater | Killing him in Liurnia locks out Boiled Prawns/Crabs and outer moat Seedbed Curse. |
| **Fia** | D, Hunter of the Dead, D's Brother, Rogier | Giving Weathered Dagger to D causes D's immediate murder. Giving Twinned Armor to brother leads to brother killing Fia's post-Fortissax corpse. |
| **Corhyn & Goldmask** | Miriel, Leyndell, Bernahl | Burning Erdtree / Maliketh kills them if the Law of Regression puzzle was not solved before Leyndell turns to ash. |
| **Sellen & Jerren** | Radahn, Azur, Lusat, Thops | Radahn must be defeated before Jerren leaves Redmane Castle. Grand Library choice is strictly binary (aid Sellen OR aid Jerren). |
| **Millicent & Gowry** | Malenia, O'Neil, Valkyrie Prosthesis | Slaying Millicent in Church of Plague or Haligtree early yields only partial rewards; final choice is strictly binary (Assist vs Betray). |
| **Hyetta & Frenzied Flame** | Irina, Edgar, Melina | Accepting Three Fingers causes Melina to abandon you at Forge of Giants and changes the final ending cutscene. Must use Miquella's Needle to undo. |
| **Boc the Seamster** | Melina, Rennala | Giving Boc a Larval Tear causes him to be reborn at Raya Lucaria as a human without Great Rune protection, dying shortly after. Must use "You're Beautiful" Prattling Pate instead! |

---

## 5. Event Flag Mapping Schema (Integration with Compass)

To translate these complex dependencies into save-aware triggers inside `apps/web`:

```typescript
export interface QuestStep {
  readonly id: string;
  readonly label: string;
  readonly location?: string;
  readonly completionFlags: readonly { readonly id: number; readonly value: 0 | 1 }[];
  readonly lockoutFlags?: readonly { readonly id: number; readonly value: 0 | 1 }[];
  readonly advice: string;
}

export interface NpcQuestline {
  readonly npcId: string;
  readonly name: string;
  readonly statusFlags: {
    readonly alive: number;
    readonly dead: number;
    readonly hostile?: number;
  };
  readonly steps: readonly QuestStep[];
  readonly linkedNpcs: readonly string[];
}
```

By querying the parsed `event_flags` bitfield from `save-parser-ts` against these step definitions, the Compass accurately evaluates:
- **Completed Steps**: All target flags match (`flag === value`).
- **Current Step**: First step with incomplete flags.
- **At Risk / Lockout Warning**: A `lockoutFlag` (e.g. `GODRICK_DEAD`, `RADAHN_DEAD`, `LEYNDELL_ASHED`) is active while a prerequisite step remains unfinished.
