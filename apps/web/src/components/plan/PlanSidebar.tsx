// import { useEffect } from 'react';
// import { X, CalendarDays, AlertTriangle, Trash2 } from 'lucide-react';
// import { format, parseISO } from 'date-fns';
// import { usePlanStore } from '@/store/planStore';
// import { cn } from '@/lib/utils';

// interface PlanSidebarProps {
//   open: boolean;
//   onClose: () => void;
// }

// export function PlanSidebar({ open, onClose }: PlanSidebarProps) {
//   const planStore = usePlanStore();
//   const items = planStore.items;
//   const conflicts = planStore.getConflicts();
//   const conflictIds = planStore.getConflictIds();

//   // Close on escape
//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') onClose();
//     };
//     window.addEventListener('keydown', handler);
//     return () => window.removeEventListener('keydown', handler);
//   }, [onClose]);

//   // Sort items by day then start time
//   const sorted = [...items].sort((a, b) => {
//     if (a.set.day !== b.set.day) return a.set.day - b.set.day;
//     return (
//       new Date(a.set.startTime).getTime() - new Date(b.set.startTime).getTime()
//     );
//   });

//   const days = [...new Set(sorted.map((i) => i.set.day))].sort();

//   return (
//     <>
//       {/* Mobile backdrop */}
//       {open && (
//         <div
//           className='fixed inset-0 bg-black/40 z-40 lg:hidden'
//           onClick={onClose}
//         />
//       )}

//       {/* Sidebar — right panel desktop, bottom drawer mobile */}
//       <aside
//         className={cn(
//           'fixed z-50 bg-sidebar border-sidebar-border transition-transform duration-300',
//           // Mobile — bottom drawer
//           'bottom-0 left-0 right-0 rounded-t-2xl border-t max-h-full overflow-y-auto',
//           'lg:bottom-auto lg:top-14.25 lg:left-auto lg:right-0 lg:w-80 lg:h-[calc(100vh-57px)]',
//           'lg:rounded-none lg:border-t-0 lg:border-l lg:overflow-y-auto',
//           // Open/closed state
//           open
//             ? 'translate-y-0 lg:translate-x-0'
//             : 'translate-y-full lg:translate-y-0 lg:translate-x-full',
//         )}
//       >
//         {/* Header */}
//         <div className='flex items-center justify-between px-4 py-3 border-b border-sidebar-border sticky top-0 bg-sidebar z-10'>
//           <div className='flex items-center gap-2'>
//             <CalendarDays className='w-4 h-4 text-muted-foreground' />
//             <span className='text-sm font-medium'>My Plan</span>
//             {items.length > 0 && (
//               <span className='text-xs bg-foreground text-background rounded-full px-1.5 py-0.5 font-medium'>
//                 {items.length}
//               </span>
//             )}
//           </div>
//           <div className='flex items-center gap-2'>
//             {items.length > 0 && (
//               <button
//                 onClick={() => planStore.clearPlan()}
//                 className='text-xs text-muted-foreground hover:text-destructive transition-colors'
//                 title='Clear plan'
//               >
//                 <Trash2 className='w-3.5 h-3.5' />
//               </button>
//             )}
//             <button
//               onClick={onClose}
//               className='w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors'
//             >
//               <X className='w-3.5 h-3.5' />
//             </button>
//           </div>
//         </div>

//         {/* Conflict banner */}
//         {conflicts.length > 0 && (
//           <div className='mx-3 mt-3 flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5'>
//             <AlertTriangle className='w-3.5 h-3.5 text-destructive shrink-0 mt-0.5' />
//             <p className='text-xs text-destructive'>
//               {conflicts.length} scheduling conflict
//               {conflicts.length > 1 ? 's' : ''} detected
//             </p>
//           </div>
//         )}

//         {/* Empty state */}
//         {items.length === 0 && (
//           <div className='flex flex-col items-center justify-center py-16 px-4 text-center'>
//             <CalendarDays className='w-8 h-8 text-muted-foreground opacity-30 mb-3' />
//             <p className='text-sm text-muted-foreground'>No sets added yet.</p>
//             <p className='text-xs text-muted-foreground mt-1'>
//               Browse a festival and tap the calendar icon to add sets.
//             </p>
//           </div>
//         )}

//         {/* Plan items grouped by day */}
//         {days.map((day) => (
//           <div key={day}>
//             <div className='px-4 pt-4 pb-1'>
//               <span className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
//                 Day {day}
//               </span>
//             </div>
//             {sorted
//               .filter((item) => item.set.day === day)
//               .map((item) => {
//                 const isConflict = conflictIds.has(item.setId);
//                 return (
//                   <div
//                     key={item.setId}
//                     className={cn(
//                       'flex items-start gap-3 px-4 py-3 border-b border-border last:border-0',
//                       isConflict && 'bg-destructive/5',
//                     )}
//                   >
//                     {/* Time */}
//                     <div className='min-w-13 text-right shrink-0'>
//                       <div className='text-xs font-medium'>
//                         {format(parseISO(item.set.startTime), 'h:mm a')}
//                       </div>
//                       <div className='text-xs text-muted-foreground'>
//                         {format(parseISO(item.set.endTime), 'h:mma')}
//                       </div>
//                     </div>

//                     {/* Info */}
//                     <div className='flex-1 min-w-0'>
//                       <div className='text-xs font-medium truncate'>
//                         {item.set.artist.name}
//                       </div>
//                       {item.set.artist.genre && (
//                         <div className='text-xs text-muted-foreground truncate mt-0.5'>
//                           {item.set.artist.genre}
//                         </div>
//                       )}
//                       {isConflict && (
//                         <div className='flex items-center gap-1 mt-1'>
//                           <AlertTriangle className='w-3 h-3 text-destructive' />
//                           <span className='text-xs text-destructive'>
//                             Overlap
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Remove */}
//                     <button
//                       onClick={() => planStore.removeItem(item.setId)}
//                       className='text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-0.5'
//                     >
//                       <X className='w-3.5 h-3.5' />
//                     </button>
//                   </div>
//                 );
//               })}
//           </div>
//         ))}
//       </aside>
//     </>
//   );
// }

import { useEffect } from 'react';
import { X, CalendarDays, AlertTriangle, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { intervalOverlap } from '@/lib/utils';
import type { ServerPlanItem } from '@/hooks/usePlan';

interface PlanSidebarProps {
  open: boolean;
  onClose: () => void;
  items: ServerPlanItem[];
  onRemove: (setId: string) => void;
  onClear: () => void;
}

export function PlanSidebar({
  open,
  onClose,
  items,
  onRemove,
  onClear,
}: PlanSidebarProps) {
  // Compute conflicts from server items
  const conflictIds = new Set<string>();
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i].set;
      const b = items[j].set;
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

  const conflictCount =
    conflictIds.size > 0 ? Math.floor(conflictIds.size / 2) : 0;

  const sorted = [...items].sort((a, b) => {
    if (a.set.day !== b.set.day) return a.set.day - b.set.day;
    return (
      new Date(a.set.startTime).getTime() - new Date(b.set.startTime).getTime()
    );
  });

  const days = [...new Set(sorted.map((i) => i.set.day))].sort();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className='fixed inset-0 bg-black/40 z-40 lg:hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed z-50 bg-sidebar border-sidebar-border transition-transform duration-300',
          'bottom-0 left-0 right-0 rounded-t-2xl border-t max-h-[70vh] overflow-y-auto',
          'lg:bottom-auto lg:top-12.25 lg:left-auto lg:right-0 lg:w-80 lg:h-[calc(100vh-49px)]',
          'lg:rounded-none lg:border-t-0 lg:border-l lg:overflow-y-auto',
          open
            ? 'translate-y-0 lg:translate-x-0'
            : 'translate-y-full lg:translate-y-0 lg:translate-x-full',
        )}
      >
        <div className='flex items-center justify-between px-4 py-3 border-b border-sidebar-border sticky top-0 bg-sidebar z-10'>
          <div className='flex items-center gap-2'>
            <CalendarDays className='w-4 h-4 text-muted-foreground' />
            <span className='text-sm font-medium'>My Plan</span>
            {items.length > 0 && (
              <span className='text-xs bg-foreground text-background rounded-full px-1.5 py-0.5 font-medium'>
                {items.length}
              </span>
            )}
          </div>
          <div className='flex items-center gap-2'>
            {items.length > 0 && (
              <button
                onClick={onClear}
                className='text-xs text-muted-foreground hover:text-destructive transition-colors'
                title='Clear plan'
              >
                <Trash2 className='w-3.5 h-3.5' />
              </button>
            )}
            <button
              onClick={onClose}
              className='w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors'
            >
              <X className='w-3.5 h-3.5' />
            </button>
          </div>
        </div>

        {conflictCount > 0 && (
          <div className='mx-3 mt-3 flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5'>
            <AlertTriangle className='w-3.5 h-3.5 text-destructive shrink-0 mt-0.5' />
            <p className='text-xs text-destructive'>
              {conflictCount} scheduling conflict{conflictCount > 1 ? 's' : ''}{' '}
              detected
            </p>
          </div>
        )}

        {items.length === 0 && (
          <div className='flex flex-col items-center justify-center py-16 px-4 text-center'>
            <CalendarDays className='w-8 h-8 text-muted-foreground opacity-30 mb-3' />
            <p className='text-sm text-muted-foreground'>No sets added yet.</p>
            <p className='text-xs text-muted-foreground mt-1'>
              Browse a festival and tap the calendar icon to add sets.
            </p>
          </div>
        )}

        {days.map((day) => (
          <div key={day}>
            <div className='px-4 pt-4 pb-1'>
              <span className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
                Day {day}
              </span>
            </div>
            {sorted
              .filter((item) => item.set.day === day)
              .map((item) => {
                const isConflict = conflictIds.has(item.set.id);
                return (
                  <div
                    key={item.setId}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 border-b border-border last:border-0',
                      isConflict && 'bg-destructive/5',
                    )}
                  >
                    <div className='min-w-13 text-right shrink-0'>
                      <div className='text-xs font-medium'>
                        {format(parseISO(item.set.startTime), 'h:mm a')}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {format(parseISO(item.set.endTime), 'h:mma')}
                      </div>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='text-xs font-medium truncate'>
                        {item.set.artist.name}
                      </div>
                      {item.set.artist.genre && (
                        <div className='text-xs text-muted-foreground truncate mt-0.5'>
                          {item.set.artist.genre}
                        </div>
                      )}
                      {item.set.stageName && (
                        <div className='text-xs text-muted-foreground truncate mt-0.5'>
                          {item.set.stageName}
                        </div>
                      )}
                      {isConflict && (
                        <div className='flex items-center gap-1 mt-1'>
                          <AlertTriangle className='w-3 h-3 text-destructive' />
                          <span className='text-xs text-destructive'>
                            Overlap
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onRemove(item.setId)}
                      className='text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-0.5'
                    >
                      <X className='w-3.5 h-3.5' />
                    </button>
                  </div>
                );
              })}
          </div>
        ))}
      </aside>
    </>
  );
}
