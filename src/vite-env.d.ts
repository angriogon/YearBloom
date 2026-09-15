/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_APP_MODE?: 'personal' | 'free' | 'demo';
  readonly VITE_MONTHLY_CHECKOUT_URL?: string;
  readonly VITE_ANNUAL_CHECKOUT_URL?: string;
  readonly VITE_LIFETIME_CHECKOUT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
