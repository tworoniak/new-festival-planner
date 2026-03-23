import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesStore {
  artistIds: Set<string>;
  toggle: (artistId: string) => void;
  has: (artistId: string) => boolean;
  count: () => number;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      artistIds: new Set(),
      toggle: (id) => {
        const next = new Set(get().artistIds);
        next.has(id) ? next.delete(id) : next.add(id);
        set({ artistIds: next });
      },
      has: (id) => get().artistIds.has(id),
      count: () => get().artistIds.size,
    }),
    {
      name: 'fp-favorites',
      storage: {
        getItem: (key) => {
          const raw = localStorage.getItem(key);
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          parsed.state.artistIds = new Set(parsed.state.artistIds);
          return parsed;
        },
        setItem: (key, value) => {
          const copy = {
            ...value,
            state: { ...value.state, artistIds: [...value.state.artistIds] },
          };
          localStorage.setItem(key, JSON.stringify(copy));
        },
        removeItem: (key) => localStorage.removeItem(key),
      },
    },
  ),
);
