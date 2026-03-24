import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import type { PlanItem } from '@festival-planner/shared';

export interface ServerPlanItem {
  id: string;
  setId: string;
  festivalId: string;
  set: {
    id: string;
    festivalId: string;
    stageId: string;
    startTime: string;
    endTime: string;
    day: number;
    stageName: string;
    artist: {
      id: string;
      name: string;
      imageUrl: string | null;
      genre: string | null;
    };
  };
}

export function usePlan(festivalId: string) {
  return useQuery({
    queryKey: ['plan', festivalId],
    queryFn: async () => {
      const res = await fetch(`/api/me/plans/${festivalId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch plan');
      return res.json() as Promise<ServerPlanItem[]>;
    },
    enabled: !!festivalId,
  });
}

export function useTogglePlan(festivalId: string) {
  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: async (setId: string) => {
      const res = await fetch('/api/me/plans', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ festivalId, setId }),
      });
      if (!res.ok) throw new Error('Failed to add to plan');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan', festivalId] });
    },
  });

  const remove = useMutation({
    mutationFn: async (setId: string) => {
      const res = await fetch(`/api/me/plans/${setId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to remove from plan');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan', festivalId] });
    },
  });

  return { add, remove };
}
