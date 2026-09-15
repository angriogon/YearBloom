import { useEffect, useMemo, useState } from 'react';
import type { AppSettings, JournalEntry, Tab } from './types';
import { BottomNav } from './components/BottomNav';
import { Garden } from './components/Garden';
import { JournalEditor } from './components/JournalEditor';
import { Memories } from './components/Memories';
import { Settings } from './components/Settings';
import { getEntries, getSettings, removeEntry, replaceEntries, saveEntry, saveSettings } from './lib/db';
import { sameYear, todayKey } from './lib/date';

const currentYear = new Date().getFullYear();
const defaults: AppSettings = {
  plan: 'premium',
  showPlantsOnlyWithEntries: false,
  selectedYear: currentYear
};

export default function App() {
  const [tab, setTab] = useState<Tab>('garden');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [settings, setSettingsState] = useState<AppSettings>(defaults);
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([getEntries(), getSettings(defaults)]).then(([storedEntries, storedSettings]) => {
      setEntries(storedEntries.sort((a, b) => a.date.localeCompare(b.date)));
      setSettingsState({ ...storedSettings, plan: 'premium' });
      setReady(true);
    });
  }, []);

  const selectedEntry = useMemo(() => entries.find((entry) => entry.date === selectedDate), [entries, selectedDate]);
  const yearEntries = useMemo(() => entries.filter((entry) => sameYear(entry.date, settings.selectedYear)), [entries, settings.selectedYear]);

  async function persistSettings(next: AppSettings) {
    const normalized = { ...next, plan: 'premium' as const };
    setSettingsState(normalized);
    await saveSettings(normalized);
  }

  async function persistEntry(entry: JournalEntry) {
    await saveEntry(entry);
    setEntries((current) => [...current.filter((item) => item.date !== entry.date), entry].sort((a, b) => a.date.localeCompare(b.date)));
  }

  async function deleteEntry(date: string) {
    await removeEntry(date);
    setEntries((current) => current.filter((entry) => entry.date !== date));
  }

  function openDate(date: string) {
    setSelectedDate(date);
    setTab('today');
  }

  async function importEntries(incoming: JournalEntry[]) {
    await replaceEntries(incoming);
    setEntries(incoming.sort((a, b) => a.date.localeCompare(b.date)));
  }

  async function mergeCloud(incoming: JournalEntry[]) {
    const merged = new Map(entries.map((entry) => [entry.date, entry]));
    for (const cloud of incoming) {
      const local = merged.get(cloud.date);
      if (!local || cloud.updatedAt > local.updatedAt) merged.set(cloud.date, cloud);
    }
    const next = [...merged.values()].sort((a, b) => a.date.localeCompare(b.date));
    await replaceEntries(next);
    setEntries(next);
  }

  if (!ready) return <div className="splash"><div className="splash-mark">✿</div><span>YearBloom</span></div>;

  return (
    <div className="app-shell">
      <main>
        {tab === 'garden' && (
          <Garden
            year={settings.selectedYear}
            entries={yearEntries}
            showOnlyWritten={settings.showPlantsOnlyWithEntries}
            onPickDate={openDate}
            onYearChange={(year) => persistSettings({ ...settings, selectedYear: year })}
            onOpenToday={() => openDate(todayKey())}
          />
        )}
        {tab === 'today' && (
          <JournalEditor
            date={selectedDate}
            entry={selectedEntry}
            plan="premium"
            onDateChange={setSelectedDate}
            onSave={persistEntry}
            onDelete={deleteEntry}
          />
        )}
        {tab === 'memories' && <Memories entries={entries} onOpen={openDate} />}
        {tab === 'settings' && (
          <Settings
            settings={settings}
            entries={entries}
            onSettingsChange={persistSettings}
            onImport={importEntries}
            onMergeCloud={mergeCloud}
          />
        )}
      </main>
      <BottomNav tab={tab} onChange={(next) => { setTab(next); if (next === 'today' && selectedDate > todayKey()) setSelectedDate(todayKey()); }} />
    </div>
  );
}
