import { useEffect, useMemo, useState } from 'react';
import type { AppSettings, JournalEntry } from '../types';
import { averageMood, countPhotos, countRecorded, currentStreak, monthlyMoodBreakdown } from '../lib/insights';
import { pullEntries, pushEntries, requestMagicLink, signOut, supabase } from '../lib/supabase';

interface SettingsProps {
  settings: AppSettings;
  entries: JournalEntry[];
  onSettingsChange: (settings: AppSettings) => void;
  onImport: (entries: JournalEntry[]) => Promise<void>;
  onMergeCloud: (entries: JournalEntry[]) => Promise<void>;
}

export function Settings({ settings, entries, onSettingsChange, onImport, onMergeCloud }: SettingsProps) {
  const [email, setEmail] = useState('');
  const [syncStatus, setSyncStatus] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUserEmail(session?.user.email ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  const summary = useMemo(() => ({
    recorded: countRecorded(entries),
    photos: countPhotos(entries),
    streak: currentStreak(entries),
    averageMood: averageMood(entries),
    months: monthlyMoodBreakdown(entries).filter((item) => item.count > 0)
  }), [entries]);

  function exportData() {
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), entries }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `yearbloom-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function importFile(file: File | undefined) {
    if (!file) return;
    const parsed = JSON.parse(await file.text()) as { entries?: JournalEntry[] } | JournalEntry[];
    const incoming = Array.isArray(parsed) ? parsed : parsed.entries;
    if (!incoming) throw new Error('El archivo no contiene entradas válidas.');
    await onImport(incoming);
  }

  async function sendMagicLink() {
    try {
      setSyncStatus('Enviando enlace…');
      await requestMagicLink(email);
      setSyncStatus('Revisa tu correo y abre el enlace desde este dispositivo.');
    } catch (error) {
      setSyncStatus(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
    }
  }

  async function uploadCloud() {
    try {
      setSyncStatus('Subiendo…');
      await pushEntries(entries);
      setSyncStatus('Copia en la nube actualizada.');
    } catch (error) {
      setSyncStatus(error instanceof Error ? error.message : 'Error al sincronizar.');
    }
  }

  async function downloadCloud() {
    try {
      setSyncStatus('Descargando…');
      const cloud = await pullEntries();
      await onMergeCloud(cloud);
      setSyncStatus(`Sincronizado: ${cloud.length} días recuperados.`);
    } catch (error) {
      setSyncStatus(error instanceof Error ? error.message : 'Error al sincronizar.');
    }
  }

  return (
    <section className="screen settings-screen">
      <header className="hero-header">
        <div>
          <p className="eyebrow">Privado, bonito y tuyo</p>
          <h1>Ajustes</h1>
          <p className="hero-copy">Todo está desbloqueado para tu uso personal. Puedes instalar la app, guardar copias y sincronizar si quieres.</p>
        </div>
      </header>

      <div className="settings-card summary-grid">
        <article className="mini-summary"><span>Días guardados</span><strong>{summary.recorded}</strong></article>
        <article className="mini-summary"><span>Fotos</span><strong>{summary.photos}</strong></article>
        <article className="mini-summary"><span>Racha</span><strong>{summary.streak}</strong></article>
        <article className="mini-summary"><span>Ánimo medio</span><strong>{summary.averageMood ?? '—'}</strong></article>
      </div>

      <div className="settings-card">
        <div className="settings-row">
          <div><strong>Todo desbloqueado</strong><p>Texto, fotos, recuerdos y uso en iPhone disponibles sin pago.</p></div>
          <span className="status-chip">Gratis</span>
        </div>
        <div className="settings-row">
          <div><strong>Mostrar solo días escritos</strong><p>Oculta plantas vacías en el jardín.</p></div>
          <label className="switch"><input type="checkbox" checked={settings.showPlantsOnlyWithEntries} onChange={(e) => onSettingsChange({ ...settings, showPlantsOnlyWithEntries: e.target.checked })} /><span /></label>
        </div>
      </div>

      {summary.months.length > 0 && (
        <>
          <h2 className="section-title">Cómo ha ido tu año</h2>
          <div className="settings-card month-list">
            {summary.months.map((month) => (
              <div className="month-row" key={month.month}>
                <strong>{month.month}</strong>
                <div className="month-bar"><span style={{ width: `${(month.average / 5) * 100}%` }} /></div>
                <small>{month.average}/5</small>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="section-title">Privacidad y copias</h2>
      <div className="settings-card">
        <div className="stacked-setting">
          <strong>Datos locales</strong>
          <p>Los recuerdos se guardan en este dispositivo. Exporta una copia cuando quieras para conservarlo todo.</p>
          <div className="button-row">
            <button className="secondary-button small" onClick={exportData}>Exportar JSON</button>
            <label className="secondary-button small file-label">Importar JSON<input type="file" accept="application/json" onChange={(e) => importFile(e.target.files?.[0])} /></label>
          </div>
        </div>
      </div>

      <h2 className="section-title">Sincronización opcional</h2>
      <div className="settings-card">
        {!supabase ? (
          <div className="stacked-setting"><strong>Supabase no configurado</strong><p>Si algún día quieres usar varios dispositivos, basta con añadir las variables de Supabase para activar la sincronización.</p></div>
        ) : userEmail ? (
          <div className="stacked-setting">
            <strong>{userEmail}</strong><p>La sesión está activa en este dispositivo.</p>
            <div className="button-row"><button className="secondary-button small" onClick={uploadCloud}>Subir copia</button><button className="secondary-button small" onClick={downloadCloud}>Descargar</button><button className="text-button" onClick={() => signOut()}>Cerrar sesión</button></div>
          </div>
        ) : (
          <div className="stacked-setting">
            <strong>Entrar por correo</strong><p>Recibe un enlace mágico para poder sincronizar sin contraseña.</p>
            <input className="search-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
            <button className="secondary-button small" disabled={!email} onClick={sendMagicLink}>Enviar enlace</button>
          </div>
        )}
        {syncStatus && <p className="sync-status">{syncStatus}</p>}
      </div>

      <h2 className="section-title">Instalar en iPhone</h2>
      <div className="settings-card">
        <div className="stacked-setting install-steps">
          <strong>Usarla como una app</strong>
          <ol>
            <li>Abre YearBloom en Safari.</li>
            <li>Toca el botón Compartir.</li>
            <li>Elige “Añadir a pantalla de inicio”.</li>
            <li>Ábrela desde el nuevo icono para verla a pantalla completa.</li>
          </ol>
        </div>
      </div>

      <p className="legal-note">YearBloom es una app original e independiente, pensada para ofrecerte una experiencia muy cuidada sin reutilizar marca ni recursos gráficos de terceros.</p>
    </section>
  );
}
