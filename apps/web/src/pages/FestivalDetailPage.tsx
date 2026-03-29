import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Star,
  CalendarPlus,
  Music,
  CalendarDays,
} from 'lucide-react';

import { PlanSidebar } from '@/components/plan/PlanSidebar';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { useFestival } from '@/hooks/useFestival';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import { usePlan, useTogglePlan } from '@/hooks/usePlan';
import { intervalOverlap } from '@/lib/utils';
import { cn } from '@/lib/utils';

import { motion } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import { staggerContainer, staggerItem, heroContent } from '@/lib/animations';

export function FestivalDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: festival, isPending, isError } = useFestival(slug!);

  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: favorites = [] } = useFavorites();
  const { data: planItems = [] } = usePlan(festival?.id ?? '');
  const { add: addFav, remove: removeFav } = useToggleFavorite();
  const { add: addPlan, remove: removePlan } = useTogglePlan(
    festival?.id ?? '',
  );

  const favoriteIds = new Set(favorites.map((f) => f.id));
  const planSetIds = new Set(planItems.map((p) => p.setId));

  const conflictIds = new Set<string>();
  for (let i = 0; i < planItems.length; i++) {
    for (let j = i + 1; j < planItems.length; j++) {
      const a = planItems[i].set;
      const b = planItems[j].set;
      if (
        intervalOverlap(
          { ...a, id: a.id, artist: a.artist },
          { ...b, id: b.id, artist: b.artist },
        )
      ) {
        conflictIds.add(a.id);
        conflictIds.add(b.id);
      }
    }
  }

  const currentStageId = activeStageId ?? festival?.stages?.[0]?.id ?? null;

  const days = useMemo(() => {
    if (!festival) return [];
    const allDays = festival.stages.flatMap((s) =>
      s.sets.map((set) => set.day),
    );
    return [...new Set(allDays)].sort();
  }, [festival]);

  const currentSets = useMemo(() => {
    if (!festival || !currentStageId) return [];
    const stage = festival.stages.find((s) => s.id === currentStageId);
    return (stage?.sets ?? [])
      .filter((s) => s.day === activeDay)
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      );
  }, [festival, currentStageId, activeDay]);

  if (isPending) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='h-80 bg-muted animate-pulse' />
        <div className='max-w-4xl mx-auto px-4 py-8 space-y-4'>
          <div className='h-4 bg-muted rounded w-1/3 animate-pulse' />
          <div className='h-4 bg-muted rounded w-2/3 animate-pulse' />
        </div>
      </div>
    );
  }

  if (isError || !festival) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-sm text-muted-foreground'>Festival not found.</p>
          <button
            onClick={() => navigate('/')}
            className='mt-4 text-sm font-medium hover:underline'
          >
            Back to festivals
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className='min-h-screen bg-background'>
        <PlanSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          items={planItems}
          onRemove={(setId) => {
            removePlan.mutate(setId);
            toast('Removed from plan');
          }}
          onClear={async () => {
            await Promise.all(
              planItems.map((item) => removePlan.mutateAsync(item.setId)),
            );
            toast('Plan cleared');
          }}
        />
        {/* Back nav */}
        <div className='border-b border-border bg-background sticky top-0 z-10'>
          <div className='max-w-4xl mx-auto px-4 h-12 flex items-center justify-between'>
            <button
              onClick={() => navigate('/')}
              aria-label='Back to festivals'
              className='flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              <ArrowLeft aria-hidden='true' className='w-4 h-4' />
              Back to Festivals
            </button>
            <div className='flex items-center gap-2'>
              <ThemeToggle />
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label={`My Plan${planItems.length > 0 ? `, ${planItems.length} set${planItems.length !== 1 ? 's' : ''}` : ''}`}
                className='flex items-center gap-2 text-sm font-medium bg-brand text-brand-foreground px-3 h-8 rounded-md hover:opacity-90 transition-opacity'
              >
                <CalendarDays aria-hidden='true' className='w-3.5 h-3.5' />
                My Plan
                {planItems.length > 0 && (
                  <span aria-hidden='true' className='bg-background/20 text-background text-xs rounded-full px-1.5 py-0.5 font-medium'>
                    {planItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className='relative h-72 md:h-96 overflow-hidden'>
          {festival.heroImageUrl ? (
            <img
              src={festival.heroImageUrl}
              alt={festival.name}
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full bg-muted flex items-center justify-center'>
              <Music className='w-12 h-12 text-muted-foreground opacity-20' />
            </div>
          )}
          <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent' />
          <motion.div
            className='absolute bottom-0 left-0 right-0 p-6 md:p-8'
            variants={heroContent}
            initial='initial'
            animate='animate'
          >
            <div className='max-w-4xl mx-auto'>
              <span className='inline-flex items-center gap-1.5 text-xs text-white/70 mb-2'>
                <Music className='w-3 h-3' /> Music Festival
              </span>
              <h1 className='text-3xl md:text-5xl font-medium text-white leading-tight'>
                {festival.name}
              </h1>
              {festival.description && (
                <p className='text-sm text-white/75 mt-2 max-w-lg line-clamp-2'>
                  {festival.description}
                </p>
              )}
              <div className='flex items-center gap-4 mt-3'>
                <span className='flex items-center gap-1.5 text-xs text-white/70'>
                  <Calendar className='w-3.5 h-3.5' />
                  {format(parseISO(festival.startDate), 'MMM d')}
                  {' – '}
                  {format(parseISO(festival.endDate), 'MMM d, yyyy')}
                </span>
                <span className='flex items-center gap-1.5 text-xs text-white/70'>
                  <MapPin className='w-3.5 h-3.5' />
                  {festival.location}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Schedule */}
        <div className='max-w-4xl mx-auto px-4 py-8'>
          <h2 className='text-xl font-medium'>Festival Schedule</h2>
          <p className='text-sm text-muted-foreground mt-1'>
            Browse set times across {festival.stages.length} stage
            {festival.stages.length !== 1 ? 's' : ''}
          </p>

          {/* Day selector */}
          {days.length > 1 && (
            <div role='group' aria-label='Select day' className='flex items-center gap-2 mt-4'>
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  aria-pressed={activeDay === day}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                    activeDay === day
                      ? 'bg-foreground text-background'
                      : 'border border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  Day {day}
                </button>
              ))}
            </div>
          )}

          {/* Stage tabs — segmented pill */}
          <div
            role='tablist'
            aria-label='Select stage'
            className='flex bg-muted rounded-lg p-1 gap-1 mt-4 overflow-x-auto'
          >
            {festival.stages.map((stage) => (
              <button
                key={stage.id}
                role='tab'
                aria-selected={currentStageId === stage.id}
                aria-controls={`tabpanel-stage-${stage.id}`}
                id={`tab-stage-${stage.id}`}
                onClick={() => setActiveStageId(stage.id)}
                className={cn(
                  'flex-1 min-w-fit px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                  currentStageId === stage.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {stage.name}
              </button>
            ))}
          </div>

          {/* Stage name */}
          <h3 className='text-lg font-medium mt-6 mb-3'>
            {festival.stages.find((s) => s.id === currentStageId)?.name}
          </h3>

          {/* Set list */}
          <div
            role='tabpanel'
            id={`tabpanel-stage-${currentStageId}`}
            aria-labelledby={`tab-stage-${currentStageId}`}
          >
          {currentSets.length === 0 ? (
            <div className='text-sm text-muted-foreground py-8 text-center'>
              No sets scheduled for this stage on Day {activeDay}.
            </div>
          ) : (
            <motion.div
              className='space-y-2'
              variants={staggerContainer}
              initial='initial'
              animate='animate'
              key={`${currentStageId}-${activeDay}`}
            >
              {currentSets.map((set) => {
                const inPlan = planSetIds.has(set.id);
                const isFav = favoriteIds.has(set.artist.id);
                const isConflict = conflictIds.has(set.id) && inPlan;

                return (
                  <motion.div
                    key={set.id}
                    variants={staggerItem}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-lg border transition-colors',
                      isConflict
                        ? 'border-destructive bg-destructive/5'
                        : inPlan
                          ? 'border-green-500/50 bg-green-500/5'
                          : 'border-border bg-card',
                    )}
                  >
                    {/* Time */}
                    <div className='min-w-25'>
                      <div className='text-sm font-medium'>
                        {format(parseISO(set.startTime), 'h:mm a')}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        ends {format(parseISO(set.endTime), 'h:mm a')}
                      </div>
                    </div>

                    {/* Artist */}
                    <div className='flex-1 min-w-0'>
                      <div className='text-sm font-medium truncate'>
                        {set.artist.name}
                      </div>
                      {set.artist.genre && (
                        <span className='inline-block text-xs bg-muted text-muted-foreground rounded px-2 py-0.5 mt-1'>
                          {set.artist.genre}
                        </span>
                      )}
                      {isConflict && (
                        <span className='inline-block text-xs bg-destructive/10 text-destructive rounded px-2 py-0.5 mt-1 ml-1'>
                          ⚠ Conflict
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className='flex items-center gap-2 shrink-0'>
                      <button
                        onClick={() => {
                          if (isFav) {
                            removeFav.mutate(set.artist.id);
                            toast('Removed from favorites');
                          } else {
                            addFav.mutate(set.artist.id);
                            toast('⭐ Added to favorites');
                          }
                        }}
                        aria-label={isFav ? `Remove ${set.artist.name} from favourites` : `Add ${set.artist.name} to favourites`}
                        aria-pressed={isFav}
                        className={cn(
                          'w-8 h-8 rounded-md border flex items-center justify-center transition-colors',
                          isFav
                            ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-700'
                            : 'border-border hover:bg-muted',
                        )}
                      >
                        <Star
                          aria-hidden='true'
                          className={cn(
                            'w-3.5 h-3.5',
                            isFav
                              ? 'fill-amber-400 stroke-amber-400'
                              : 'stroke-muted-foreground',
                          )}
                        />
                      </button>
                      <button
                        onClick={() => {
                          if (inPlan) {
                            removePlan.mutate(set.id);
                            toast('Removed from plan');
                          } else {
                            addPlan.mutate(set.id);
                            toast('📅 Added to plan');
                          }
                        }}
                        aria-label={inPlan ? `Remove ${set.artist.name} from plan` : `Add ${set.artist.name} to plan`}
                        aria-pressed={inPlan}
                        className={cn(
                          'w-8 h-8 rounded-md border flex items-center justify-center transition-colors',
                          inPlan
                            ? 'bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-700'
                            : 'border-border hover:bg-muted',
                        )}
                      >
                        <CalendarPlus
                          aria-hidden='true'
                          className={cn(
                            'w-3.5 h-3.5',
                            inPlan
                              ? 'stroke-green-600'
                              : 'stroke-muted-foreground',
                          )}
                        />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
