export interface Festival {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl: string;
  heroImageUrl: string;
  stages: Stage[];
}

export interface Stage {
  id: string;
  festivalId: string;
  name: string;
  order: number;
  sets?: Set[];
}

export interface Artist {
  id: string;
  name: string;
  imageUrl?: string | null;
  genre?: string | null;
  bio?: string | null;
}

export interface Set {
  id: string;
  festivalId: string;
  stageId: string;
  stageName?: string;
  artist: Artist;
  startTime: string; // ISO datetime string
  endTime: string; // ISO datetime string
  day: number; // 1-indexed day of festival
}

export interface PlanItem {
  setId: string;
  festivalId: string;
  set: Set;
}

export interface ConflictPair {
  a: PlanItem;
  b: PlanItem;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
}
