import { eventFlagOffset } from '@elden-ring-compass/data';
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  MapPinIcon,
  RotateCcwIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { ConnectSaveButton } from '@/components/misc/save-file-source-selector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { QUESTLINES, type QuestStep } from '@/lib/quests-data';
import { cn } from '@/lib/utils';
import { inventoryDbView } from '@/lib/vm/inventory';
import { useSelectedSlot } from '@/stores/slot-selection-store';

export function QuestsView() {
  const slot = useSelectedSlot();
  const connected = !!slot;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedQuests, setExpandedQuests] = useState<Record<string, boolean>>({
    ranni: true,
  });
  const [manualOverrides, setManualOverrides] = useState<Record<string, boolean>>({});

  // Resolve inventory items from active save slot
  const invItems = useMemo(() => {
    if (!slot) return [];
    try {
      return inventoryDbView(slot).items;
    } catch {
      return [];
    }
  }, [slot]);

  const itemNamesSet = useMemo(() => {
    return new Set(invItems.map((i) => i.item_name.toLowerCase()));
  }, [invItems]);

  const hasItem = (target: string): boolean => {
    const t = target.toLowerCase();
    if (itemNamesSet.has(t)) return true;
    for (const it of invItems) {
      if (it.item_name.toLowerCase().includes(t)) return true;
    }
    return false;
  };

  // Evaluate if an event flag is set in the active character save
  const isFlagSet = (flagId?: number): boolean => {
    if (!slot || !flagId) return false;
    const offset = eventFlagOffset(flagId);
    if (!offset) return false;
    return ((slot.event_flags.flags[offset[0]] ?? 0) & (1 << offset[1])) !== 0;
  };

  // Check if a step is directly verified by save signals
  const isStepDirectlyDone = (step: QuestStep): boolean => {
    if (!slot) return false;
    if (isFlagSet(step.flagId)) return true;
    if (step.altFlagIds?.some((id) => isFlagSet(id))) return true;
    if (step.bossFlagIds?.some((id) => isFlagSet(id))) return true;
    if (step.graceFlagIds?.some((id) => isFlagSet(id))) return true;
    if (step.itemNames?.some((name) => hasItem(name))) return true;
    return false;
  };

  // Compute status map for each questline: direct match, sequential propagation, manual override
  const questStatusMap = useMemo(() => {
    const res: Record<
      string,
      {
        isDone: boolean;
        isDirect: boolean;
        isInferred: boolean;
        isManual: boolean;
      }
    > = {};

    for (const quest of QUESTLINES) {
      const directFlags = quest.steps.map((s) => isStepDirectlyDone(s));

      // In FromSoft questlines, reaching/completing step K implies all preceding prerequisite steps 1..(K-1) are satisfied.
      let highestDirectIdx = -1;
      for (let i = quest.steps.length - 1; i >= 0; i--) {
        if (directFlags[i]) {
          highestDirectIdx = i;
          break;
        }
      }

      for (let i = 0; i < quest.steps.length; i++) {
        const step = quest.steps[i];
        if (!step) continue;
        const direct = Boolean(directFlags[i]);
        const inferred = !direct && highestDirectIdx >= 0 && i < highestDirectIdx;
        const autoDone = direct || inferred;

        const manual = manualOverrides[step.id];
        const finalDone = manual !== undefined ? manual : autoDone;

        res[step.id] = {
          isDone: finalDone,
          isDirect: direct,
          isInferred: inferred,
          isManual: manual !== undefined,
        };
      }
    }

    return res;
  }, [slot, invItems, manualOverrides]);

  const toggleExpand = (questId: string) => {
    setExpandedQuests((prev) => ({ ...prev, [questId]: !prev[questId] }));
  };

  const handleStepToggle = (stepId: string, currentDone: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    setManualOverrides((prev) => {
      const next = { ...prev };
      next[stepId] = !currentDone;
      return next;
    });
  };

  const resetOverrides = () => {
    setManualOverrides({});
  };

  const hasManualOverrides = Object.keys(manualOverrides).length > 0;

  // Filter questlines
  const filteredQuests = useMemo(() => {
    return QUESTLINES.filter((q) => {
      if (selectedCategory !== 'All' && q.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() === '') return true;
      const qLower = searchQuery.toLowerCase();
      return (
        q.name.toLowerCase().includes(qLower) ||
        q.character.toLowerCase().includes(qLower) ||
        q.summary.toLowerCase().includes(qLower) ||
        q.steps.some(
          (s) =>
            s.title.toLowerCase().includes(qLower) ||
            s.location.toLowerCase().includes(qLower) ||
            s.description.toLowerCase().includes(qLower),
        )
      );
    });
  }, [searchQuery, selectedCategory]);

  // Global completion statistics
  const stats = useMemo(() => {
    let totalSteps = 0;
    let completedSteps = 0;
    let completedQuests = 0;

    for (const q of QUESTLINES) {
      totalSteps += q.steps.length;
      const doneCount = q.steps.filter((s) => questStatusMap[s.id]?.isDone).length;
      completedSteps += doneCount;
      if (doneCount === q.steps.length && q.steps.length > 0) {
        completedQuests++;
      }
    }

    const pct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    return { totalSteps, completedSteps, completedQuests, pct };
  }, [questStatusMap]);

  return (
    <div className='flex flex-1 flex-col gap-4 sm:gap-6 p-3 sm:p-6 md:p-8 max-w-7xl mx-auto w-full'>
      {/* Page Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-border/40 pb-4 sm:pb-6'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Quest Compass</h1>
            <Badge variant='outline' className='text-amber-500 border-amber-500/30 bg-amber-500/10 text-[10px] sm:text-xs'>
              Save-Aware
            </Badge>
          </div>
          <p className='text-xs sm:text-sm text-muted-foreground max-w-2xl'>
            Interactive quest tracker evaluating real-time event flags, inventory items, and grace
            checkpoints from your Elden Ring save file. Discover your next objective and avoid locking
            yourself out of vital storylines.
          </p>
        </div>

        <div className='flex items-center gap-2 sm:gap-3 shrink-0'>
          {hasManualOverrides && (
            <Button
              variant='outline'
              size='sm'
              onClick={resetOverrides}
              className='text-xs h-8 sm:h-9 flex items-center gap-1.5'
            >
              <RotateCcwIcon className='size-3.5' />
              Reset Checks
            </Button>
          )}
          <ConnectSaveButton />
        </div>
      </div>

      {/* Progress & Stat Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4'>
        <Card className='p-3 sm:p-4 bg-card/60 backdrop-blur-sm'>
          <div className='text-[10px] sm:text-xs text-muted-foreground uppercase font-medium'>Total Questlines</div>
          <div className='text-xl sm:text-2xl font-bold mt-0.5 sm:mt-1'>{QUESTLINES.length}</div>
          <div className='text-[10px] sm:text-xs text-muted-foreground mt-0.5'>Tracked NPC paths</div>
        </Card>

        <Card className='p-3 sm:p-4 bg-card/60 backdrop-blur-sm'>
          <div className='text-[10px] sm:text-xs text-muted-foreground uppercase font-medium'>Steps Completed</div>
          <div className='text-xl sm:text-2xl font-bold mt-0.5 sm:mt-1 text-emerald-500'>
            {stats.completedSteps}{' '}
            <span className='text-xs sm:text-sm font-normal text-muted-foreground'>/ {stats.totalSteps}</span>
          </div>
          <div className='text-[10px] sm:text-xs text-muted-foreground mt-0.5'>{stats.pct}% total progression</div>
        </Card>

        <Card className='p-3 sm:p-4 bg-card/60 backdrop-blur-sm'>
          <div className='text-[10px] sm:text-xs text-muted-foreground uppercase font-medium'>Quests Finished</div>
          <div className='text-xl sm:text-2xl font-bold mt-0.5 sm:mt-1 text-amber-500'>
            {stats.completedQuests}{' '}
            <span className='text-xs sm:text-sm font-normal text-muted-foreground'>/ {QUESTLINES.length}</span>
          </div>
          <div className='text-[10px] sm:text-xs text-muted-foreground mt-0.5'>Terminal states reached</div>
        </Card>

        <Card className='p-3 sm:p-4 bg-card/60 backdrop-blur-sm'>
          <div className='text-[10px] sm:text-xs text-muted-foreground uppercase font-medium'>Save Status</div>
          <div className='text-xl sm:text-2xl font-bold mt-0.5 sm:mt-1 flex items-center gap-2'>
            {connected ? (
              <span className='text-emerald-500 text-base sm:text-lg flex items-center gap-1.5'>
                <span className='size-2 rounded-full bg-emerald-500' />
                Connected
              </span>
            ) : (
              <span className='text-muted-foreground text-sm sm:text-base font-medium'>No Save Loaded</span>
            )}
          </div>
          <div className='text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate'>
            {slot ? slot.player_game_data.character_name : 'Static guide mode'}
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className='flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between'>
        <div className='flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0'>
          {['All', 'Major Ending', 'Companion'].map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size='sm'
              onClick={() => setSelectedCategory(cat)}
              className='text-xs h-8 px-2.5 shrink-0'
            >
              {cat === 'All' ? 'All Quests' : cat}
            </Button>
          ))}
        </div>

        <div className='w-full sm:w-72'>
          <Input
            placeholder='Search NPC, location, or item...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='h-8 sm:h-9 text-xs'
          />
        </div>
      </div>

      {/* Questline List */}
      <div className='flex flex-col gap-4'>
        {filteredQuests.map((quest) => {
          const isExpanded = !!expandedQuests[quest.id];
          const completedCount = quest.steps.filter((s) => questStatusMap[s.id]?.isDone).length;
          const isFullyDone = completedCount === quest.steps.length && quest.steps.length > 0;
          const currentStepIndex = quest.steps.findIndex((s) => !questStatusMap[s.id]?.isDone);
          const nextStep = currentStepIndex !== -1 ? quest.steps[currentStepIndex] : null;
          const progressPercent = Math.round((completedCount / quest.steps.length) * 100);

          return (
            <Card
              key={quest.id}
              className={cn(
                'transition-all duration-200 border-border/50 bg-card/40 hover:bg-card/70 backdrop-blur-sm',
                isFullyDone && 'border-emerald-500/30 bg-emerald-950/10',
              )}
            >
              {/* Card Header & Summary Bar */}
              <CardHeader
                className='p-3.5 sm:p-6 cursor-pointer select-none'
                onClick={() => toggleExpand(quest.id)}
              >
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3'>
                  <div className='space-y-1 sm:space-y-1.5'>
                    <div className='flex flex-wrap items-center gap-1.5 sm:gap-2'>
                      <CardTitle className='text-base sm:text-lg font-bold hover:text-amber-500 transition-colors'>
                        {quest.name}
                      </CardTitle>
                      <Badge variant='secondary' className='text-[10px] sm:text-[11px] font-normal'>
                        {quest.category}
                      </Badge>
                      {quest.endingLink && (
                        <Badge
                          variant='outline'
                          className='text-[10px] sm:text-[11px] border-amber-500/40 text-amber-500 bg-amber-500/5'
                        >
                          {quest.endingLink}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className='text-xs leading-relaxed text-muted-foreground max-w-3xl'>
                      {quest.summary}
                    </CardDescription>
                  </div>

                  {/* Progress Pill and Toggle */}
                  <div className='flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t border-border/20 sm:border-t-0 shrink-0'>
                    <div className='text-left sm:text-right'>
                      <div className='text-xs font-semibold'>
                        {completedCount} / {quest.steps.length} Steps
                      </div>
                      <div className='w-24 sm:w-28 h-1.5 bg-secondary rounded-full overflow-hidden mt-1'>
                        <div
                          className={cn(
                            'h-full transition-all duration-300',
                            isFullyDone ? 'bg-emerald-500' : 'bg-amber-500',
                          )}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <Button variant='ghost' size='icon' className='size-8 shrink-0'>
                      {isExpanded ? (
                        <ChevronUpIcon className='size-4 text-muted-foreground' />
                      ) : (
                        <ChevronDownIcon className='size-4 text-muted-foreground' />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Immediate Next Step Callout */}
                {!isFullyDone && nextStep && (
                  <div className='mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
                    <div className='flex items-start sm:items-center gap-2 sm:gap-2.5'>
                      <div className='size-5 sm:size-6 rounded-full bg-amber-500/20 text-amber-500 text-[11px] sm:text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 sm:mt-0'>
                        {nextStep.order}
                      </div>
                      <div>
                        <div className='text-xs font-semibold text-amber-500 flex items-center gap-1.5'>
                          NEXT OBJECTIVE: <span>{nextStep.title}</span>
                        </div>
                        <div className='text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5'>
                          <MapPinIcon className='size-3 text-muted-foreground' />
                          {nextStep.location}
                        </div>
                      </div>
                    </div>
                    {nextStep.requiresBefore && (
                      <Badge
                        variant='outline'
                        className='border-rose-500/40 text-rose-400 bg-rose-500/10 text-[10px]'
                      >
                        {nextStep.requiresBefore}
                      </Badge>
                    )}
                  </div>
                )}

                {isFullyDone && (
                  <div className='mt-2.5 sm:mt-3 flex items-center gap-2 text-xs text-emerald-400 font-medium'>
                    <CheckCircle2Icon className='size-4 text-emerald-500' />
                    Questline Completed in this save.
                  </div>
                )}
              </CardHeader>

              {/* Step Timeline */}
              {isExpanded && (
                <CardContent className='pt-0 pb-4 sm:pb-6 px-3.5 sm:px-6 border-t border-border/20 mt-2'>
                  <div className='relative pl-7 sm:pl-8 space-y-4 sm:space-y-6 before:absolute before:left-2.5 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-border/60 mt-3 sm:mt-4'>
                    {quest.steps.map((step, idx) => {
                      const status = questStatusMap[step.id] ?? {
                        isDone: false,
                        isDirect: false,
                        isInferred: false,
                        isManual: false,
                      };
                      const isDone = status.isDone;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <div key={step.id} className='relative flex flex-col gap-1 sm:gap-1.5'>
                          {/* Dot / Indicator — Clickable with touch-manipulation and comfortable tap target */}
                          <button
                            type='button'
                            title={isDone ? 'Click to mark uncompleted' : 'Click to mark completed'}
                            onClick={(e) => handleStepToggle(step.id, isDone, e)}
                            className={cn(
                              'absolute -left-7 sm:-left-8 top-0.5 size-5 rounded-full border-2 bg-background flex items-center justify-center transition-all cursor-pointer touch-manipulation active:scale-90',
                              isDone && 'border-emerald-500 bg-emerald-500 text-white',
                              isCurrent && 'border-amber-500 bg-amber-500/20 ring-4 ring-amber-500/20',
                              !isDone && !isCurrent && 'border-muted-foreground/30 bg-muted/40 hover:border-amber-400',
                            )}
                          >
                            {isDone && <CheckCircle2Icon className='size-3.5' />}
                          </button>

                          {/* Step Header */}
                          <div className='flex flex-wrap items-center gap-1.5 sm:gap-2'>
                            <span
                              className={cn(
                                'text-xs sm:text-sm font-semibold tracking-tight',
                                isDone && 'text-muted-foreground line-through opacity-80',
                                isCurrent && 'text-amber-400 font-bold',
                              )}
                            >
                              Step {step.order}: {step.title}
                            </span>

                            <div className='flex items-center gap-1 text-[10px] sm:text-[11px] text-muted-foreground bg-secondary/40 px-2 py-0.5 rounded-full'>
                              <MapPinIcon className='size-2.5 sm:size-3 text-muted-foreground' />
                              <span>{step.location}</span>
                            </div>

                            {step.missable && (
                              <Badge
                                variant='outline'
                                className='text-[9px] sm:text-[10px] text-rose-400 border-rose-500/30 bg-rose-500/10'
                              >
                                Missable
                              </Badge>
                            )}

                            {isDone && (
                              <Badge
                                variant='outline'
                                className={cn(
                                  'text-[9px] sm:text-[10px] border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
                                  status.isManual && 'border-sky-500/30 bg-sky-500/10 text-sky-400',
                                )}
                              >
                                {status.isManual
                                  ? 'Manual check'
                                  : status.isDirect
                                    ? 'Save verified'
                                    : 'Completed'}
                              </Badge>
                            )}
                          </div>

                          {/* Step Description */}
                          <p className='text-xs leading-relaxed text-muted-foreground max-w-3xl'>
                            {step.description}
                          </p>

                          {/* Warnings / Prerequisites */}
                          {step.requiresBefore && (
                            <div className='flex items-center gap-1.5 text-xs text-rose-400 mt-1'>
                              <AlertTriangleIcon className='size-3.5 shrink-0' />
                              <span>Important: {step.requiresBefore}</span>
                            </div>
                          )}

                          {/* Rewards Tags */}
                          {step.rewards && step.rewards.length > 0 && (
                            <div className='flex flex-wrap gap-1.5 mt-1.5'>
                              {step.rewards.map((rew) => (
                                <Badge
                                  key={rew}
                                  variant='secondary'
                                  className='text-[10px] bg-secondary/60 text-secondary-foreground'
                                >
                                  {rew}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
