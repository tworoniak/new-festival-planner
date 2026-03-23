import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Set, PlanItem, ConflictPair } from '@festival-planner/shared';
import { intervalOverlap } from '@/lib/utils';

interface PlanStore {
  items: PlanItem[];
  sidebarOpen: boolean;
  addItem: (set: Set, festivalId: string) => void;
  removeItem: (setId: string) => void;
  hasItem: (setId: string) => boolean;
  getConflicts: () => ConflictPair[];
  getConflictIds: () => Set<string>;
  toggleSidebar: () => void;
  clearPlan: () => void;
}

export const usePlanStore = create<PlanStore>()(
  persist(
    (set, get) => ({
      items: [],
      sidebarOpen: false,

      addItem: (festivalSet, festivalId) => {
        const item: PlanItem = {
          setId: festivalSet.id,
          festivalId,
          set: festivalSet,
        };
        set((s) => ({ items: [...s.items, item] }));
      },

      removeItem: (setId) => {
        set((s) => ({ items: s.items.filter((i) => i.setId !== setId) }));
      },

      hasItem: (setId) => get().items.some((i) => i.setId === setId),

      getConflicts: () => {
        const items = get().items;
        const conflicts: ConflictPair[] = [];
        for (let i = 0; i < items.length; i++) {
          for (let j = i + 1; j < items.length; j++) {
            if (intervalOverlap(items[i].set, items[j].set)) {
              conflicts.push({ a: items[i], b: items[j] });
            }
          }
        }
        return conflicts;
      },

      getConflictIds: () => {
        const conflictIds = new Set<string>();
        get()
          .getConflicts()
          .forEach(({ a, b }) => {
            conflictIds.add(a.setId);
            conflictIds.add(b.setId);
          });
        return conflictIds;
      },

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      clearPlan: () => set({ items: [] }),
    }),
    { name: 'fp-plan' },
  ),
);
