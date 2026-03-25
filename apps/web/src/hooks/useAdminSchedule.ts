import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Stage {
  id: string;
  festivalId: string;
  name: string;
  order: number;
}

export interface SetRow {
  id: string;
  festivalId: string;
  stageId: string;
  startTime: string;
  endTime: string;
  day: number;
  artist: { id: string; name: string; genre: string | null };
  stage: { id: string; name: string };
}

export function useStages(festivalId: string) {
  return useQuery({
    queryKey: ['admin', 'stages', festivalId],
    queryFn: async () => {
      const res = await fetch(`/api/stages?festivalId=${festivalId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch stages');
      return res.json() as Promise<Stage[]>;
    },
    enabled: !!festivalId,
  });
}

export function useSets(festivalId: string) {
  return useQuery({
    queryKey: ['admin', 'sets', festivalId],
    queryFn: async () => {
      const res = await fetch(`/api/sets?festivalId=${festivalId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch sets');
      return res.json() as Promise<SetRow[]>;
    },
    enabled: !!festivalId,
  });
}

export function useCreateStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      festivalId: string;
      name: string;
      order: number;
    }) => {
      const res = await fetch('/api/stages', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create stage');
      return res.json();
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['admin', 'stages', vars.festivalId] }),
  });
}

export function useDeleteStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      festivalId,
    }: {
      id: string;
      festivalId: string;
    }) => {
      const res = await fetch(`/api/stages/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete stage');
      return festivalId;
    },
    onSuccess: (festivalId) =>
      qc.invalidateQueries({ queryKey: ['admin', 'stages', festivalId] }),
  });
}

export function useCreateSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch('/api/sets', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create set');
      return res.json();
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: ['admin', 'sets', vars.festivalId as string],
      }),
  });
}

export function useDeleteSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      festivalId,
    }: {
      id: string;
      festivalId: string;
    }) => {
      const res = await fetch(`/api/sets/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete set');
      return festivalId;
    },
    onSuccess: (festivalId) =>
      qc.invalidateQueries({ queryKey: ['admin', 'sets', festivalId] }),
  });
}
