export type Mood = 1 | 2 | 3 | 4 | 5;
export type Plan = 'free' | 'premium';
export type Tab = 'garden' | 'today' | 'memories' | 'settings';

export interface JournalEntry {
  date: string;
  mood?: Mood;
  text: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  plan: Plan;
  showPlantsOnlyWithEntries: boolean;
  selectedYear: number;
}
