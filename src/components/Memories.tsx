import { useMemo, useState } from 'react';
import type { JournalEntry, Mood } from '../types';
import { formatLong } from '../lib/date';
import { hasContent, moodLabel } from '../lib/insights';
import { Plant } from './Plant';

interface MemoriesProps {
  entries: JournalEntry[];
  onOpen: (date: string) => void;
}

const filters: { label: string; value: Mood | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 }
];

export function Memories({ entries, onOpen }: MemoriesProps) {
  const [query, setQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState<Mood | 'all'>('all');

  const filtered = useMemo(() => entries
    .filter((entry) => hasContent(entry))
    .filter((entry) => moodFilter === 'all' ? true : entry.mood === moodFilter)
    .filter((entry) => !query || `${entry.text} ${formatLong(entry.date)}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date)), [entries, query, moodFilter]);

  return (
    <section className="screen memories-screen">
      <header className="hero-header memories-header">
        <div>
          <p className="eyebrow">Vuelve cuando quieras</p>
          <h1>Recuerdos</h1>
          <p className="hero-copy">Busca días especiales, repasa etapas y revive lo que has ido guardando.</p>
        </div>
      </header>

      <input className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar en tus recuerdos" />
      <div className="filter-row" role="tablist" aria-label="Filtrar por ánimo">
        {filters.map((filter) => (
          <button key={String(filter.value)} className={moodFilter === filter.value ? 'filter-chip active' : 'filter-chip'} onClick={() => setMoodFilter(filter.value)}>
            {filter.label}
          </button>
        ))}
      </div>

      <div className="memory-list">
        {filtered.map((entry) => (
          <button className="memory-card" key={entry.date} onClick={() => onOpen(entry.date)}>
            <Plant date={entry.date} mood={entry.mood} active size={48} />
            <div className="memory-copy">
              <strong>{formatLong(entry.date)}</strong>
              <p>{entry.text || 'Día guardado con estado de ánimo o fotos.'}</p>
              <div className="memory-meta">
                {entry.mood && <small>{moodLabel(entry.mood)}</small>}
                {entry.images.length > 0 && <small>{entry.images.length} foto{entry.images.length > 1 ? 's' : ''}</small>}
              </div>
            </div>
            {entry.images[0] && <img src={entry.images[0]} alt="Miniatura" />}
          </button>
        ))}
        {!filtered.length && <div className="empty-state"><span>❀</span><p>Aún no hay recuerdos que coincidan con esa búsqueda.</p></div>}
      </div>
    </section>
  );
}
