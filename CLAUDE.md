# Atlas

Personal life tracker for one user (the owner): fitness and health from Garmin, habits, gym sessions, sports, and later email, agenda, notes, Drive and photos. React Native + Expo (SDK 58) + TypeScript (strict), NativeWind v4, React Navigation (bottom tabs), Supabase self-hosted on a Windows mini-PC. All user-facing copy is Dutch; code, comments and commits are English. Architecture follows Stride (`C:\S`); check there before inventing a pattern.

## Commands

- `pnpm check` — must pass before work is done: typecheck, ESLint, Vitest, Prettier. CI runs it plus a database rebuild from migrations; a Claude Code Stop hook formats changed files and runs it.
- `pnpm start` runs Metro. Native builds go through EAS (internal distribution + EAS Update).
- Local database (Docker Desktop): `pnpm db:start`, `db:stop`, `db:status`, `db:new <name>`, `db:reset`. Ports are 544xx (API 54421, DB 54422, Studio 54423). `.env.local` points the app at it by the PC's LAN IP (`.env.example`).

## Non-negotiables

- No login, by design: the app reaches Supabase only over Tailscale. Only webhook/OAuth-callback Edge Functions are public (Tailscale Funnel), and they verify their caller.
- Schema changes only through migration files (`pnpm db:new`), never the dashboard or MCP. A migration already on `origin/main` never changes; add a new one.
- The repo is public: no personal data (the CSV exports are gitignored), no secrets, no service-role key.

## Conventions

- Import with `@/` (→ `src/`). Named exports only (except `App.tsx`); components are function declarations with `interface XProps`. No `any`.
- Feature folders in `src/features/<feature>/` with `components/ hooks/ screens/`; screens are thin, logic lives in hooks or pure files beside them.
- Style with NativeWind `className`; inline `style` only for dynamic values. Colours come from `src/theme/palette.ts` (Tailwind classes, or `palette` for props that cannot read a class); hex literals elsewhere fail lint. Corners are near-square.
- Text goes through `@/components/Text` (Inter 500 in ink by default). Headings and numbers use Bitter: `ScreenTitle`, `SectionTitle`, `SmallHeader`, `Metric` in `Typography.tsx`.
- Every Supabase result has its `error` read (lint rule).
- Days are `yyyy-MM-dd` strings (`toDayKey`/`fromDayKey` in `src/lib/days.ts`); never `parseISO`.
- `src/types/database.ts` is hand-written; update it with every migration.
- Unit tests (`*.test.ts`) run in plain Node, so only pure modules are testable.

## Git

- Work on `main` (short feature branches are fine). Commit only when asked.
- Commit message: one line, `type(scope): subject`, under 72 characters, no body, no AI attribution. The `commit-msg` hook enforces it (`pnpm install` enables it).
- Files under `docs/` are snake_case.
