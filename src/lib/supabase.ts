import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { JournalEntry } from '../types';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;

export async function requestMagicLink(email: string): Promise<void> {
  if (!supabase) throw new Error('Supabase no está configurado.');
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.href.split('#')[0] }
  });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function pushEntries(entries: JournalEntry[]): Promise<void> {
  if (!supabase) throw new Error('Supabase no está configurado.');
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error('Inicia sesión para sincronizar.');

  const rows = entries.map((entry) => ({
    user_id: user.id,
    entry_date: entry.date,
    mood: entry.mood ?? null,
    text: entry.text,
    images: entry.images,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt
  }));
  if (!rows.length) return;
  const { error } = await supabase.from('journal_entries').upsert(rows, { onConflict: 'user_id,entry_date' });
  if (error) throw error;
}

export async function pullEntries(): Promise<JournalEntry[]> {
  if (!supabase) throw new Error('Supabase no está configurado.');
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error('Inicia sesión para sincronizar.');
  const { data, error } = await supabase
    .from('journal_entries')
    .select('entry_date,mood,text,images,created_at,updated_at')
    .eq('user_id', user.id);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    date: row.entry_date,
    mood: row.mood ?? undefined,
    text: row.text ?? '',
    images: Array.isArray(row.images) ? row.images : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}
