import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FestivalSummary } from './useFestivals';

export function useAdminFestivals() {
  return useQuery({
    queryKey: ['admin', 'festivals'],
    queryFn: async () => {
      const res = await fetch('/api/festivals', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch festivals');
      return res.json() as Promise<FestivalSummary[]>;
    },
  });
}

export function useAdminFestival(id: string) {
  return useQuery({
    queryKey: ['admin', 'festival', id],
    queryFn: async () => {
      const res = await fetch(`/api/festivals/${id}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch festival');
      return res.json() as Promise<FestivalSummary>;
    },
    enabled: !!id && id !== 'new',
  });
}

export function useCreateFestival() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch('/api/festivals', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message ?? 'Failed to create festival');
      }
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'festivals'] }),
  });
}

export function useUpdateFestival() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, unknown>;
    }) => {
      const res = await fetch(`/api/festivals/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message ?? 'Failed to update festival');
      }
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'festivals'] }),
  });
}

export function useDeleteFestival() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/festivals/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete festival');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'festivals'] }),
  });
}
