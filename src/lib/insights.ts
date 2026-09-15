import type { JournalEntry, Mood } from '../types';
import { todayKey, toDateKey } from './date';

export function hasContent(entry?: JournalEntry): boolean {
  return Boolean(entry?.mood || entry?.text?.trim() || entry?.images?.length);
}

export function countRecorded(entries: JournalEntry[]): number {
  return entries.filter((entry) => hasContent(entry)).length;
}

export function countPhotos(entries: JournalEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.images.length, 0);
}

export function currentStreak(entries: JournalEntry[]): number {
  const recorded = new Set(entries.filter(hasContent).map((entry) => entry.date));
  let streak = 0;
  const pointer = new Date();
  pointer.setHours(0, 0, 0, 0);

  while (recorded.has(toDateKey(pointer))) {
    streak += 1;
    pointer.setDate(pointer.getDate() - 1);
  }

  return streak;
}

export function averageMood(entries: JournalEntry[]): number | null {
  const moods = entries.map((entry) => entry.mood).filter(Boolean) as Mood[];
  if (!moods.length) return null;
  const average = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
  return Number(average.toFixed(1));
}

export function monthlyMoodBreakdown(entries: JournalEntry[]) {
  const months = Array.from({ length: 12 }, (_, index) => ({
    month: new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(new Date(2024, index, 1)),
    average: 0,
    count: 0
  }));

  for (const entry of entries) {
    if (!entry.mood) continue;
    const month = Number(entry.date.slice(5, 7)) - 1;
    months[month].average += entry.mood;
    months[month].count += 1;
  }

  return months.map((month) => ({
    ...month,
    average: month.count ? Number((month.average / month.count).toFixed(1)) : 0
  }));
}

export function moodLabel(mood?: Mood): string {
  if (!mood) return 'Sin ánimo';
  return ({
    1: 'Muy difícil',
    2: 'Bajo',
    3: 'Tranquilo',
    4: 'Bien',
    5: 'Muy feliz'
  } as Record<Mood, string>)[mood];
}

export function isToday(date: string): boolean {
  return date === todayKey();
}
