import { useQuery } from '@tanstack/react-query';

export interface FestivalSummary {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  shortDescription: string | null;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl: string | null;
  heroImageUrl: string | null;
  createdAt: string | null;
}

export function useFestivals(year?: number) {
  return useQuery({
    queryKey: ['festivals', year],
    queryFn: async () => {
      const url = year ? `/api/festivals?year=${year}` : '/api/festivals';
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch festivals');
      return res.json() as Promise<FestivalSummary[]>;
    },
  });
}
