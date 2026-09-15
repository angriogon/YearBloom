import type { JournalEntry } from '../types';
import { daysInYear, formatShort, isFuture, todayKey } from '../lib/date';
import { averageMood, countPhotos, countRecorded, currentStreak, hasContent } from '../lib/insights';
import { Plant } from './Plant';

interface GardenProps {
  year: number;
  entries: JournalEntry[];
  showOnlyWritten: boolean;
  onPickDate: (date: string) => void;
  onYearChange: (year: number) => void;
  onOpenToday: () => void;
}

export function Garden({ year, entries, showOnlyWritten, onPickDate, onYearChange, onOpenToday }: GardenProps) {
  const entryMap = new Map(entries.map((entry) => [entry.date, entry]));
  const days = daysInYear(year);
  const recorded = countRecorded(entries);
  const completion = Math.round((recorded / days.length) * 100);
  const streak = currentStreak(entries);
  const photos = countPhotos(entries);
  const avgMood = averageMood(entries);
  const todayEntry = entryMap.get(todayKey());
  const currentYear = new Date().getFullYear();
  const isCurrentYear = year === currentYear;

  return (
    <section className="screen garden-screen">
      <header className="hero-header hero-header-garden">
        <div>
          <p className="eyebrow">Un jardín íntimo, bonito y tuyo</p>
          <h1>Tu año en flor</h1>
          <p className="hero-copy">Cada día guarda un pequeño rastro de cómo estabas, qué viviste y qué quieres recordar.</p>
        </div>
        <div className="year-stepper" aria-label="Cambiar año">
          <button onClick={() => onYearChange(year - 1)} aria-label="Año anterior">‹</button>
          <strong>{year}</strong>
          <button onClick={() => onYearChange(year + 1)} aria-label="Año siguiente" disabled={year >= currentYear}>›</button>
        </div>
      </header>

      {isCurrentYear && (
        <div className="today-card">
          <div>
            <span className="tiny-label">HOY</span>
            <strong>{todayEntry && hasContent(todayEntry) ? 'Tu día ya tiene recuerdo' : 'Tu día sigue en blanco'}</strong>
            <p>{todayEntry?.text ? todayEntry.text.slice(0, 90) : 'Abre el día y añade una emoción, unas líneas o alguna foto especial.'}</p>
          </div>
          <button className="primary-button compact" onClick={onOpenToday}>{todayEntry && hasContent(todayEntry) ? 'Abrir hoy' : 'Escribir hoy'}</button>
        </div>
      )}

      <div className="stats-grid">
        <article className="stat-card"><span>Recuerdos</span><strong>{recorded}</strong><small>{completion}% del año cubierto</small></article>
        <article className="stat-card"><span>Racha</span><strong>{streak}</strong><small>{streak === 1 ? 'día seguido' : 'días seguidos'}</small></article>
        <article className="stat-card"><span>Fotos</span><strong>{photos}</strong><small>guardadas contigo</small></article>
        <article className="stat-card"><span>Ánimo medio</span><strong>{avgMood ?? '—'}</strong><small>{avgMood ? 'sobre 5 puntos' : 'aún sin datos'}</small></article>
      </div>

      <div className="progress-card">
        <div><strong>{recorded}</strong><span> días con memoria</span></div>
        <div className="progress-track"><span style={{ width: `${completion}%` }} /></div>
        <small>{completion}% del jardín registrado este año</small>
      </div>

      <div className="garden-month-labels">
        {['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'].map((month) => <span key={month}>{month}</span>)}
      </div>

      <div className="garden-grid" role="grid" aria-label={`Jardín de ${year}`}>
        {days.map((day) => {
          const entry = entryMap.get(day);
          const hasEntry = hasContent(entry);
          const hidden = showOnlyWritten && !hasEntry;
          return (
            <button
              key={day}
              className={hidden ? 'plant-button ghost' : 'plant-button'}
              onClick={() => !isFuture(day) && onPickDate(day)}
              disabled={isFuture(day)}
              title={formatShort(day)}
              aria-label={`Abrir ${formatShort(day)}`}
            >
              {!hidden && <Plant date={day} mood={entry?.mood} active={hasEntry} future={isFuture(day)} size={30} />}
            </button>
          );
        })}
      </div>
    </section>
  );
}
