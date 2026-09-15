const pad = (value: number) => String(value).padStart(2, '0');

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function daysInYear(year: number): string[] {
  const result: string[] = [];
  const date = new Date(year, 0, 1);
  while (date.getFullYear() === year) {
    result.push(toDateKey(date));
    date.setDate(date.getDate() + 1);
  }
  return result;
}

export function formatLong(key: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(fromDateKey(key));
}

export function formatShort(key: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short'
  }).format(fromDateKey(key));
}

export function isFuture(key: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return fromDateKey(key).getTime() > today.getTime();
}

export function sameYear(key: string, year: number): boolean {
  return Number(key.slice(0, 4)) === year;
}
