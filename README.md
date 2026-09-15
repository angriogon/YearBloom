# YearBloom PWA

YearBloom is an independent, installable iPhone web app that recreates the **functionality pattern** of a one-year visual journal: daily mood, text memories, up to five photos, a 365-day growing garden, search/revisit, offline storage, free/full feature gating and optional cross-device sync.

It deliberately **does not copy** third-party branding, source code, hand-drawn plant assets, screenshots or proprietary text. The plants are original procedural SVG illustrations generated from the date.

## What is included

- 365-day visual garden, with a deterministic original plant for each date.
- Daily mood tracking in the free tier.
- Full tier: text journal + up to 5 photos per day.
- Camera/photo picker optimized for iPhone (`capture="environment"`).
- Image compression before local storage.
- Browse/search old memories.
- Offline-first storage using IndexedDB.
- Export/import JSON backup.
- PWA manifest, offline service worker and Apple home-screen metadata.
- Optional Supabase magic-link login and cross-device sync.
- Demo paywall with monthly/annual/lifetime options and optional external checkout URLs.
- Responsive mobile-first UI designed for standalone iOS use.

## Important iOS web limitation

A pure PWA cannot provide native **Home Screen / Lock Screen widgets** like a Swift iOS app can. It can be installed to the Home Screen and run standalone/offline, but native widgets require an iOS app/widget extension. If native widgets are mandatory, use this UI/data layer as the basis for a Capacitor/React Native or Swift version and add a WidgetKit extension.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL in Safari/Chrome. The default app mode is `demo`, so Settings lets you switch between Free and Full.

## App modes

In `.env`:

```bash
VITE_APP_MODE=demo
```

- `demo`: Free/Full can be switched locally for testing.
- `free`: forces the free tier.
- `personal`: unlocks all Full functionality. Recommended for a private personal deployment.

## Optional cloud sync with Supabase

1. Create a free Supabase project.
2. Open its SQL Editor and run `supabase/schema.sql`.
3. Add the project URL and anon key to `.env`:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

4. In Supabase Authentication, enable Email / Magic Link and add your deployed GitHub Pages URL as an allowed redirect URL.

The included prototype synchronizes compressed image data in the database JSON row for simplicity. For a larger production deployment, move photos to Supabase Storage and store only their URLs in the journal row.

## Optional billing

You can point the three paywall options to Stripe Payment Links:

```bash
VITE_MONTHLY_CHECKOUT_URL=https://buy.stripe.com/...
VITE_ANNUAL_CHECKOUT_URL=https://buy.stripe.com/...
VITE_LIFETIME_CHECKOUT_URL=https://buy.stripe.com/...
```

For a real commercial app, **do not unlock premium only in the browser**. Use Stripe webhooks + a server/Supabase Edge Function to update a user entitlement in the database, then read that entitlement after authentication. The local demo switch is intentionally only for testing/personal use.

## Deploy to GitHub Pages

Create a repository, push this folder, and enable **Settings → Pages → GitHub Actions**. The workflow in `.github/workflows/deploy-pages.yml` builds and publishes the app.

After deployment on iPhone:

1. Open the GitHub Pages URL in Safari.
2. Tap **Share**.
3. Tap **Add to Home Screen**.
4. Launch YearBloom from the new icon.

## Privacy notes

- Without Supabase, journal data stays in the browser storage on the device.
- Clearing Safari website data can delete local-only entries, so use Export regularly.
- With Supabase enabled, row-level security in `schema.sql` restricts each signed-in user to their own journal rows.

## Production hardening checklist

Before publishing commercially, add: server-verified billing entitlements, Supabase Storage for photos, end-to-end encrypted backups if required, account deletion, privacy/terms pages, automated tests, error reporting consent, CSP/security headers and a native solution if true iOS widgets/biometric app locking are required.
