import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface FavoriteArtist {
  id: string;
  name: string;
  imageUrl: string | null;
  genre: string | null;
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await fetch('/api/me/favorites', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch favorites');
      return res.json() as Promise<FavoriteArtist[]>;
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: async (artistId: string) => {
      const res = await fetch('/api/me/favorites', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artistId }),
      });
      if (!res.ok) throw new Error('Failed to add favorite');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  const remove = useMutation({
    mutationFn: async (artistId: string) => {
      const res = await fetch(`/api/me/favorites/${artistId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to remove favorite');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  return { add, remove };
}
