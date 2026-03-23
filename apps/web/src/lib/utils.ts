import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { parseISO } from 'date-fns';
import type { Set } from '@festival-planner/shared';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function intervalOverlap(a: Set, b: Set): boolean {
  if (a.id === b.id) return false;
  if (a.stageId === b.stageId) return false;
  if (a.day !== b.day) return false;
  const aStart = parseISO(a.startTime);
  const aEnd = parseISO(a.endTime);
  const bStart = parseISO(b.startTime);
  const bEnd = parseISO(b.endTime);
  return aStart < bEnd && bStart < aEnd;
}
