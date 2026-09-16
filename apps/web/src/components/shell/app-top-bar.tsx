import { useLocation } from '@tanstack/react-router';

import { DarkModeToggle } from '@/components/misc/dark-mode-toggle';
import { ConnectSaveButton } from '@/components/misc/save-file-source-selector';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { statsDbView } from '@/lib/vm/stats';
import { useSelectedSlot } from '@/stores/slot-selection-store';

import { SECTION_META } from './nav';

// Exact match first; otherwise fall back to the longest section prefix so
// dynamic children (e.g. /inventory/weapons-shields) inherit their parent's
// title. '/' is excluded as a prefix since it matches everything.
function resolveSectionMeta(pathname: string): { title: string; sub: string } {
  const exact = SECTION_META[pathname];
  if (exact) return exact;
  const prefix = Object.keys(SECTION_META)
    .filter((k) => k !== '/' && pathname.startsWith(k))
    .toSorted((a, b) => b.length - a.length)[0];
  return (prefix ? SECTION_META[prefix] : undefined) ?? { title: 'Elden Ring Compass+', sub: '' };
}

export function AppTopBar() {
  const pathname = useLocation({ select: (l) => l.pathname });
  const meta = resolveSectionMeta(pathname);
  const slot = useSelectedSlot();
  const connected = !!slot;
  const stats = slot ? statsDbView(slot) : null;

  return (
    <div className='sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-7 md:py-4'>
      {/* Collapses the icon rail on desktop; opens the off-canvas sidebar Sheet
          on mobile (the sidebar is the single source of nav + connection now). */}
      <SidebarTrigger className='-ml-1 shrink-0' />
      <Separator orientation='vertical' className='!h-6 shrink-0' />

      <div className='min-w-0 flex-1'>
        <h2 className='truncate text-lg font-semibold tracking-tight md:text-[22px]'>
          {meta.title}
        </h2>
        <div className='truncate text-[13px] text-muted-foreground'>{meta.sub}</div>
      </div>

      {/* Quick mobile actions. Full controls live in the sidebar Sheet (open via
          the trigger); these stay surfaced for one-tap access on small screens. */}
      <div className='flex shrink-0 items-center gap-2 md:hidden'>
        {connected && stats ? (
          <div
            className='flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] font-medium tabular-nums'
            title={`${slot?.player_game_data.character_name ?? 'Tarnished'} · Level ${stats.stats.level} · ${stats.stats.souls.toLocaleString()} runes`}
          >
            <span className='font-semibold'>Lv.{stats.stats.level}</span>
            <span className='text-muted-foreground'>·</span>
            <span className='text-amber-500 font-semibold'>{stats.stats.souls.toLocaleString()}</span>
          </div>
        ) : (
          <ConnectSaveButton variant='outline' size='sm' />
        )}
        <DarkModeToggle />
      </div>
    </div>
  );
}
