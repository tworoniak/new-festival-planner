import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import {
  useStages,
  useSets,
  useCreateStage,
  useDeleteStage,
  useCreateSet,
  useDeleteSet,
} from '@/hooks/useAdminSchedule';
import { useAdminArtists } from '@/hooks/useAdminArtists';
import { useFestival } from '@/hooks/useFestival';
import { cn } from '@/lib/utils';

const StageSchema = z.object({
  name: z.string().min(1, 'Stage name is required'),
  order: z.coerce.number().int().min(0).default(0),
});

const SetSchema = z.object({
  stageId: z.string().min(1, 'Stage is required'),
  artistId: z.string().min(1, 'Artist is required'),
  day: z.coerce.number().int().min(1, 'Day is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
});

type StageInput = z.infer<typeof StageSchema>;
type SetInput = z.infer<typeof SetSchema>;

export function ScheduleAdminPage() {
  const { id: festivalId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: festival } = useFestival(festivalId!);
  const { data: stages = [] } = useStages(festivalId!);
  const { data: sets = [] } = useSets(festivalId!);
  const { data: artists = [] } = useAdminArtists();

  const createStage = useCreateStage();
  const deleteStage = useDeleteStage();
  const createSet = useCreateSet();
  const deleteSet = useDeleteSet();

  const [showStageForm, setShowStageForm] = useState(false);
  const [showSetForm, setShowSetForm] = useState(false);
  const [confirmDeleteStage, setConfirmDeleteStage] = useState<string | null>(
    null,
  );
  const [confirmDeleteSet, setConfirmDeleteSet] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(1);

  const stageForm = useForm<StageInput>({ resolver: zodResolver(StageSchema) });
  const setForm = useForm<SetInput>({ resolver: zodResolver(SetSchema) });

  const days =
    sets.length > 0 ? [...new Set(sets.map((s) => s.day))].sort() : [1];

  const filteredSets = sets.filter((s) => s.day === activeDay);

  const onCreateStage = async (data: StageInput) => {
    try {
      await createStage.mutateAsync({
        festivalId: festivalId!,
        name: data.name,
        order: data.order,
      });
      toast.success('Stage created');
      stageForm.reset();
      setShowStageForm(false);
    } catch {
      toast.error('Failed to create stage');
    }
  };

  const onCreateSet = async (data: SetInput) => {
    try {
      // Build ISO datetime strings using a base date
      const baseDate = festival?.startDate
        ? new Date(festival.startDate)
        : new Date();
      baseDate.setDate(baseDate.getDate() + data.day - 1);
      const dateStr = format(baseDate, 'yyyy-MM-dd');

      await createSet.mutateAsync({
        festivalId: festivalId!,
        stageId: data.stageId,
        artistId: data.artistId,
        day: data.day,
        startTime: `${dateStr}T${data.startTime}:00`,
        endTime: `${dateStr}T${data.endTime}:00`,
      });
      toast.success('Set added');
      setForm.reset();
      setShowSetForm(false);
    } catch {
      toast.error('Failed to add set');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className='flex items-center gap-3 mb-6'>
        <button
          onClick={() => navigate('/admin/festivals')}
          aria-label='Back to festivals'
          className='w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors'
        >
          <ArrowLeft aria-hidden='true' className='w-4 h-4' />
        </button>
        <div>
          <h1 className='text-xl font-medium'>
            {festival?.name ?? 'Schedule'}
          </h1>
          <p className='text-sm text-muted-foreground mt-0.5'>
            Manage stages and set times
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* LEFT — Stages */}
        <div className='lg:col-span-1'>
          <div className='border border-border rounded-lg overflow-hidden'>
            <div className='flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30'>
              <span className='text-sm font-medium'>Stages</span>
              <button
                onClick={() => setShowStageForm(!showStageForm)}
                aria-label={showStageForm ? 'Cancel adding stage' : 'Add stage'}
                aria-expanded={showStageForm}
                className='w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors'
              >
                <Plus aria-hidden='true' className='w-3.5 h-3.5' />
              </button>
            </div>

            {/* Stage form */}
            {showStageForm && (
              <div className='px-4 py-3 border-b border-border bg-muted/10'>
                <form
                  onSubmit={stageForm.handleSubmit(onCreateStage)}
                  className='space-y-2'
                >
                  <input
                    {...stageForm.register('name')}
                    placeholder='Stage name'
                    className='w-full h-8 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring'
                  />
                  {stageForm.formState.errors.name && (
                    <p className='text-xs text-destructive'>
                      {stageForm.formState.errors.name.message}
                    </p>
                  )}
                  <div className='flex gap-2'>
                    <input
                      {...stageForm.register('order')}
                      type='number'
                      placeholder='Order'
                      className='w-20 h-8 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring'
                    />
                    <button
                      type='submit'
                      className='h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity'
                    >
                      Add
                    </button>
                    <button
                      type='button'
                      onClick={() => setShowStageForm(false)}
                      className='h-8 px-3 rounded-md border border-border text-xs hover:bg-muted transition-colors'
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Stage list */}
            {stages.length === 0 && !showStageForm && (
              <div className='px-4 py-8 text-center text-sm text-muted-foreground'>
                No stages yet. Add one to get started.
              </div>
            )}
            {stages.map((stage) => (
              <div
                key={stage.id}
                className='flex items-center justify-between px-4 py-3 border-b border-border last:border-0 hover:bg-muted/20 transition-colors'
              >
                <div>
                  <div className='text-sm font-medium'>{stage.name}</div>
                  <div className='text-xs text-muted-foreground'>
                    Order: {stage.order}
                  </div>
                </div>
                {confirmDeleteStage === stage.id ? (
                  <div className='flex items-center gap-1'>
                    <button
                      onClick={async () => {
                        try {
                          await deleteStage.mutateAsync({
                            id: stage.id,
                            festivalId: festivalId!,
                          });
                          toast.success('Stage deleted');
                          setConfirmDeleteStage(null);
                        } catch {
                          toast.error('Failed to delete stage');
                        }
                      }}
                      className='h-7 px-2 rounded text-xs bg-destructive text-destructive-foreground hover:opacity-90'
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDeleteStage(null)}
                      className='h-7 px-2 rounded text-xs border border-border hover:bg-muted'
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteStage(stage.id)}
                    className='w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors'
                  >
                    <Trash2 className='w-3 h-3' />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Sets */}
        <div className='lg:col-span-2'>
          <div className='border border-border rounded-lg overflow-hidden'>
            <div className='flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30'>
              <span className='text-sm font-medium shrink-0'>Sets</span>
              {/* Day tabs — scrollable if many days */}
              <div className='flex bg-muted rounded-md p-0.5 gap-0.5 overflow-x-auto flex-1 min-w-0'>
                {days.map((day) => (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={cn(
                      'h-6 px-2.5 rounded text-xs font-medium transition-colors shrink-0',
                      activeDay === day
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    Day {day}
                  </button>
                ))}
                {/* Add day button */}
                <button
                  onClick={() => setActiveDay(Math.max(...days) + 1)}
                  aria-label='Add new day'
                  className='h-6 px-2 rounded text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0'
                >
                  <Plus aria-hidden='true' className='w-3 h-3' />
                </button>
              </div>
              <button
                onClick={() => setShowSetForm(!showSetForm)}
                className='flex items-center gap-1.5 h-7 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shrink-0'
              >
                <Plus className='w-3 h-3' />
                <span className='hidden sm:inline'>Add Set</span>
                <span className='sm:hidden'>Add</span>
              </button>
            </div>

            {/* Set form */}
            {showSetForm && (
              <div className='px-4 py-3 border-b border-border bg-muted/10'>
                <form
                  onSubmit={setForm.handleSubmit(onCreateSet)}
                  className='space-y-3'
                >
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {/* Stage */}
                    <div className='space-y-1'>
                      <label className='text-xs font-medium text-muted-foreground'>
                        Stage
                      </label>
                      <select
                        {...setForm.register('stageId')}
                        className='w-full h-8 rounded-md border border-border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring'
                      >
                        <option value=''>Select stage...</option>
                        {stages.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      {setForm.formState.errors.stageId && (
                        <p className='text-xs text-destructive'>
                          {setForm.formState.errors.stageId.message}
                        </p>
                      )}
                    </div>

                    {/* Artist */}
                    <div className='space-y-1'>
                      <label className='text-xs font-medium text-muted-foreground'>
                        Artist
                      </label>
                      <select
                        {...setForm.register('artistId')}
                        className='w-full h-8 rounded-md border border-border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring'
                      >
                        <option value=''>Select artist...</option>
                        {artists.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                      {setForm.formState.errors.artistId && (
                        <p className='text-xs text-destructive'>
                          {setForm.formState.errors.artistId.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                    {/* Day */}
                    <div className='space-y-1'>
                      <label className='text-xs font-medium text-muted-foreground'>
                        Day
                      </label>
                      <input
                        {...setForm.register('day')}
                        type='number'
                        min='1'
                        defaultValue={activeDay}
                        className='w-full h-8 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring'
                      />
                    </div>

                    {/* Start time */}
                    <div className='space-y-1'>
                      <label className='text-xs font-medium text-muted-foreground'>
                        Start
                      </label>
                      <input
                        {...setForm.register('startTime')}
                        type='time'
                        className='w-full h-8 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring'
                      />
                      {setForm.formState.errors.startTime && (
                        <p className='text-xs text-destructive'>
                          {setForm.formState.errors.startTime.message}
                        </p>
                      )}
                    </div>

                    {/* End time */}
                    <div className='space-y-1'>
                      <label className='text-xs font-medium text-muted-foreground'>
                        End
                      </label>
                      <input
                        {...setForm.register('endTime')}
                        type='time'
                        className='w-full h-8 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring'
                      />
                      {setForm.formState.errors.endTime && (
                        <p className='text-xs text-destructive'>
                          {setForm.formState.errors.endTime.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='flex gap-2'>
                    <button
                      type='submit'
                      className='h-8 px-4 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity'
                    >
                      Add Set
                    </button>
                    <button
                      type='button'
                      onClick={() => setShowSetForm(false)}
                      className='h-8 px-3 rounded-md border border-border text-xs hover:bg-muted transition-colors'
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Sets list */}
            {filteredSets.length === 0 && !showSetForm && (
              <div className='px-4 py-8 text-center text-sm text-muted-foreground'>
                No sets for Day {activeDay}. Add one above.
              </div>
            )}

            {filteredSets
              .sort(
                (a, b) =>
                  new Date(a.startTime).getTime() -
                  new Date(b.startTime).getTime(),
              )
              .map((set) => (
                <div
                  key={set.id}
                  className='flex items-center gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/20 transition-colors'
                >
                  {/* Time */}
                  <div className='min-w-22.5'>
                    <div className='flex items-center gap-1 text-xs font-medium'>
                      <Clock className='w-3 h-3 text-muted-foreground' />
                      {format(parseISO(set.startTime), 'h:mm a')}
                    </div>
                    <div className='text-xs text-muted-foreground ml-4'>
                      {format(parseISO(set.endTime), 'h:mm a')}
                    </div>
                  </div>

                  {/* Artist + Stage */}
                  <div className='flex-1 min-w-0'>
                    <div className='text-sm font-medium truncate'>
                      {set.artist.name}
                    </div>
                    <div className='text-xs text-muted-foreground truncate'>
                      {set.stage.name}
                      {set.artist.genre && ` · ${set.artist.genre}`}
                    </div>
                  </div>

                  {/* Delete */}
                  {confirmDeleteSet === set.id ? (
                    <div className='flex items-center gap-1 shrink-0'>
                      <button
                        onClick={async () => {
                          try {
                            await deleteSet.mutateAsync({
                              id: set.id,
                              festivalId: festivalId!,
                            });
                            toast.success('Set removed');
                            setConfirmDeleteSet(null);
                          } catch {
                            toast.error('Failed to remove set');
                          }
                        }}
                        className='h-7 px-2 rounded text-xs bg-destructive text-destructive-foreground hover:opacity-90'
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDeleteSet(null)}
                        className='h-7 px-2 rounded text-xs border border-border hover:bg-muted'
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteSet(set.id)}
                      className='w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors shrink-0'
                    >
                      <Trash2 className='w-3 h-3' />
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
