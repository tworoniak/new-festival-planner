import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Artist {
  id: string;
  name: string;
  genre: string | null;
  imageUrl: string | null;
  bio: string | null;
  createdAt: string | null;
}

export function useAdminArtists() {
  return useQuery({
    queryKey: ['admin', 'artists'],
    queryFn: async () => {
      const res = await fetch('/api/artists', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch artists');
      return res.json() as Promise<Artist[]>;
    },
  });
}

export function useAdminArtist(id: string) {
  return useQuery({
    queryKey: ['admin', 'artist', id],
    queryFn: async () => {
      const res = await fetch(`/api/artists/${id}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch artist');
      return res.json() as Promise<Artist>;
    },
    enabled: !!id && id !== 'new',
  });
}

export function useCreateArtist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch('/api/artists', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message ?? 'Failed to create artist');
      }
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'artists'] }),
  });
}

export function useUpdateArtist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, unknown>;
    }) => {
      const res = await fetch(`/api/artists/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message ?? 'Failed to update artist');
      }
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'artists'] }),
  });
}

export function useDeleteArtist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/artists/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete artist');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'artists'] }),
  });
}
