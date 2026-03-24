import { useQuery } from '@tanstack/react-query';
import type { FestivalSummary } from './useFestivals';

export interface StageWithSets {
  id: string;
  festivalId: string;
  name: string;
  order: number;
  sets: SetWithArtist[];
}

export interface SetWithArtist {
  id: string;
  festivalId: string;
  stageId: string;
  startTime: string;
  endTime: string;
  day: number;
  artist: {
    id: string;
    name: string;
    imageUrl: string | null;
    genre: string | null;
  };
}

export interface FestivalDetail extends FestivalSummary {
  stages: StageWithSets[];
}

export function useFestival(slug: string) {
  return useQuery({
    queryKey: ['festival', slug],
    queryFn: async () => {
      const res = await fetch(`/api/festivals/${slug}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch festival');
      return res.json() as Promise<FestivalDetail>;
    },
    enabled: !!slug,
  });
}
