import { useEffect, useMemo, useRef, useState } from 'react';
import type { JournalEntry, Mood, Plan } from '../types';
import { compressImage } from '../lib/image';
import { formatLong, fromDateKey, isFuture, toDateKey, todayKey } from '../lib/date';
import { moodLabel } from '../lib/insights';
import { Plant } from './Plant';

interface JournalEditorProps {
  date: string;
  entry?: JournalEntry;
  plan: Plan;
  onDateChange: (date: string) => void;
  onSave: (entry: JournalEntry) => Promise<void>;
  onDelete: (date: string) => Promise<void>;
}

const moodLabels: { mood: Mood; emoji: string; label: string }[] = [
  { mood: 1, emoji: '☁︎', label: 'Difícil' },
  { mood: 2, emoji: '◔', label: 'Bajo' },
  { mood: 3, emoji: '○', label: 'En calma' },
  { mood: 4, emoji: '☼', label: 'Bien' },
  { mood: 5, emoji: '✦', label: 'Muy feliz' }
];

const prompts = [
  'Hoy quiero recordar…',
  'Lo más bonito de este día ha sido…',
  'Algo que he aprendido hoy…',
  'Una sensación que me llevo conmigo…'
];

export function JournalEditor({ date, entry, plan, onDateChange, onSave, onDelete }: JournalEditorProps) {
  const [mood, setMood] = useState<Mood | undefined>(entry?.mood);
  const [text, setText] = useState(entry?.text ?? '');
  const [images, setImages] = useState<string[]>(entry?.images ?? []);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMood(entry?.mood);
    setText(entry?.text ?? '');
    setImages(entry?.images ?? []);
    setSaveStatus('');
  }, [date, entry]);

  const dateStrip = useMemo(() => {
    const center = fromDateKey(date);
    return Array.from({ length: 7 }, (_, index) => {
      const d = new Date(center);
      d.setDate(d.getDate() + index - 3);
      return toDateKey(d);
    }).filter((key) => key <= todayKey());
  }, [date]);

  const canSave = Boolean(mood || text.trim() || images.length);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const remaining = Math.max(0, 5 - images.length);
    const picked = Array.from(files).slice(0, remaining);
    const compressed = await Promise.all(picked.map(compressImage));
    setImages((current) => [...current, ...compressed].slice(0, 5));
  }

  async function save() {
    setSaving(true);
    const now = new Date().toISOString();
    const next: JournalEntry = {
      date,
      mood,
      text: text.trim(),
      images,
      createdAt: entry?.createdAt ?? now,
      updatedAt: now
    };
    await onSave(next);
    setSaving(false);
    setSaveStatus('Guardado en este dispositivo');
    window.setTimeout(() => setSaveStatus(''), 2200);
  }

  async function remove() {
    if (!window.confirm('¿Eliminar este recuerdo? Esta acción no se puede deshacer.')) return;
    await onDelete(date);
    setMood(undefined);
    setText('');
    setImages([]);
    setSaveStatus('Recuerdo eliminado');
  }

  function appendPrompt(prompt: string) {
    setText((current) => current.trim().length ? `${current.trim()}\n\n${prompt} ` : `${prompt} `);
  }

  const title = date === todayKey() ? 'Hoy' : formatLong(date);

  return (
    <section className="screen editor-screen">
      <header className="editor-header">
        <div className="plant-feature"><Plant date={date} mood={mood} active={Boolean(mood || text || images.length)} size={76} /></div>
        <p className="eyebrow">Un momento al día</p>
        <h1>{title}</h1>
        <p className="muted intro-copy">Guarda tu emoción, escribe un pequeño recuerdo y añade fotos si te apetece.</p>
      </header>

      <div className="date-strip" aria-label="Días cercanos">
        {dateStrip.map((day) => {
          const d = fromDateKey(day);
          const active = day === date;
          return (
            <button key={day} className={active ? 'date-pill active' : 'date-pill'} onClick={() => onDateChange(day)}>
              <span>{new Intl.DateTimeFormat('es-ES', { weekday: 'narrow' }).format(d)}</span>
              <strong>{d.getDate()}</strong>
            </button>
          );
        })}
      </div>

      <div className="journal-card">
        <div className="field-label"><span>¿Cómo te has sentido?</span><small>1–5</small></div>
        <div className="mood-row">
          {moodLabels.map((item) => (
            <button
              key={item.mood}
              className={mood === item.mood ? `mood mood-${item.mood} selected` : `mood mood-${item.mood}`}
              onClick={() => setMood(item.mood)}
              aria-label={item.label}
            >
              <span>{item.emoji}</span><small>{item.label}</small>
            </button>
          ))}
        </div>

        <div className="mood-summary">
          <strong>{moodLabel(mood)}</strong>
          <span>{mood ? 'Tu flor reflejará este estado de ánimo.' : 'Elige el tono emocional del día si te apetece.'}</span>
        </div>

        <div className="field-label"><span>Recuerdo</span><small>Texto libre</small></div>
        <div className="prompt-row">
          {prompts.map((prompt) => (
            <button key={prompt} className="prompt-chip" onClick={() => appendPrompt(prompt)}>{prompt}</button>
          ))}
        </div>
        <textarea
          value={text}
          placeholder="Escribe lo que quieras recordar de este día…"
          rows={7}
          onChange={(e) => setText(e.target.value)}
          readOnly={isFuture(date)}
        />

        <div className="field-label"><span>Fotos</span><small>{images.length}/5</small></div>
        {images.length > 0 && (
          <div className="photo-grid">
            {images.map((src, index) => (
              <div className="photo-tile" key={`${src.slice(0, 30)}-${index}`}>
                <img src={src} alt={`Recuerdo ${index + 1}`} />
                <button onClick={() => setImages((current) => current.filter((_, i) => i !== index))} aria-label="Quitar foto">×</button>
              </div>
            ))}
          </div>
        )}
        <input ref={fileRef} className="hidden-input" type="file" accept="image/*" capture="environment" multiple onChange={(e) => handleFiles(e.target.files)} />
        <button className="secondary-button" onClick={() => fileRef.current?.click()}>
          ＋ Añadir o hacer foto
        </button>

        <div className="editor-actions">
          <button className="primary-button" disabled={saving || !canSave || isFuture(date)} onClick={save}>{saving ? 'Guardando…' : 'Guardar el día'}</button>
          {saveStatus && <span className="save-status" role="status">{saveStatus}</span>}
          {entry && <button className="danger-link" onClick={remove}>Eliminar recuerdo</button>}
        </div>
      </div>

      {plan === 'premium' && <p className="tiny muted centered-copy">Todos los recuerdos y fotos están desbloqueados en esta versión personal gratuita.</p>}
    </section>
  );
}
