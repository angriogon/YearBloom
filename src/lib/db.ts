import type { AppSettings, JournalEntry } from '../types';

const DB_NAME = 'yearbloom-db';
const DB_VERSION = 1;
const ENTRY_STORE = 'entries';
const SETTINGS_STORE = 'settings';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ENTRY_STORE)) {
        db.createObjectStore(ENTRY_STORE, { keyPath: 'date' });
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

export async function getEntries(): Promise<JournalEntry[]> {
  const db = await openDb();
  const tx = db.transaction(ENTRY_STORE, 'readonly');
  const entries = await requestToPromise(tx.objectStore(ENTRY_STORE).getAll() as IDBRequest<JournalEntry[]>);
  db.close();
  return entries;
}

export async function saveEntry(entry: JournalEntry): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(ENTRY_STORE, 'readwrite');
  tx.objectStore(ENTRY_STORE).put(entry);
  await transactionDone(tx);
  db.close();
}

export async function removeEntry(date: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(ENTRY_STORE, 'readwrite');
  tx.objectStore(ENTRY_STORE).delete(date);
  await transactionDone(tx);
  db.close();
}

export async function getSettings(defaults: AppSettings): Promise<AppSettings> {
  const db = await openDb();
  const tx = db.transaction(SETTINGS_STORE, 'readonly');
  const stored = await requestToPromise(tx.objectStore(SETTINGS_STORE).get('app')) as { key: string; value: AppSettings } | undefined;
  db.close();
  return stored?.value ?? defaults;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(SETTINGS_STORE, 'readwrite');
  tx.objectStore(SETTINGS_STORE).put({ key: 'app', value: settings });
  await transactionDone(tx);
  db.close();
}

export async function replaceEntries(entries: JournalEntry[]): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(ENTRY_STORE, 'readwrite');
  const store = tx.objectStore(ENTRY_STORE);
  store.clear();
  for (const entry of entries) store.put(entry);
  await transactionDone(tx);
  db.close();
}
