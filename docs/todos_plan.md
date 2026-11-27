# Todos, then email

Two features, in order. Todos ship first and are useful alone; email builds on them. Atlas has no tables, no data hooks and no push yet, so step 1 sets the first conventions.

## Phase 1: Todos (replaces Notion for todos)

Scope: lists/projects, due dates, reminders (push), one-time Notion import. No recurrence, no subtasks.

### 1. Schema (`pnpm db:new todos`)

- `todo_lists`: `id uuid pk`, `name text not null`, `position int not null`, `created_at`.
- `todos`: `id uuid pk`, `list_id → todo_lists (on delete cascade)`, `title text not null`, `notes text`, `due_date date`, `remind_at timestamptz`, `completed_at timestamptz`, `position int`, `created_at`, `updated_at`.
- Done is `completed_at is not null`, not a status enum. Email suggestions get their own table in phase 2, so `todos` never changes for them.
- Indexes: `todos (list_id, position)`, partial `todos (due_date) where completed_at is null`, partial `todos (remind_at) where completed_at is null and remind_at is not null`.
- RLS on, one `anon` policy per table (single user, Tailscale only). These are the first tables, so this sets the convention for later ones.
- `push_devices`: `expo_token text pk`, `created_at`, `last_seen_at`. Written by the app, read by the reminder function.
- Update `src/types/database.ts` in the same change.

### 2. Pure logic (`src/features/todos/`, unit-tested)

- `todoGroups.ts`: group open todos into Te laat / Vandaag / Morgen / Deze week / Later / Zonder datum from `yyyy-MM-dd` keys (`toDayKey`, never `parseISO`).
- `todoForm.ts`: input to payload (trim, empty-title rejection, due-date and reminder parsing, Dutch error strings).
- Tests beside both files.

### 3. Data hooks (`hooks/`, plain `useState`/`useEffect` + `supabase`, as in Stride)

`useTodos`, `useTodoLists`, `useSaveTodo`, `useCompleteTodo`, `useSaveList`. Every Supabase result has its `error` read and goes through `errorMessage`/`logError`.

### 4. Screens and navigation

- `TodosScreen` (grouped list, check-off, quick add), `TodoEditScreen` (title, notes, list, due date, reminder), `TodoListsScreen` (manage lists).
- Entry: a card on the Dashboard and a row in Meer, with a native stack for the edit screens. No sixth tab; the bar is full. Revisit if you use todos more than Fitness/Sport.
- Dutch copy throughout; NativeWind + palette tokens only.

### 5. Reminders (push, reused by email later)

- Add `expo-notifications`; register the device token into `push_devices` on app start. This needs a new native build (EAS, or the local build from `C:\A`).
- Edge Function `send-reminders`: selects due `remind_at`, sends through Expo's push API, then clears or advances `remind_at`. Called by `pg_cron` every minute over the internal network, so it is not public.
- Sending lives in a shared `_shared/push.ts` so phase 2 reuses it.

### 6. Notion import

- `scripts/import_notion_todos.ts` reads a Notion export from a gitignored path and maps pages to lists and todos. Idempotent via a stable key (title + list + created date), the same approach as the CSV importers.
- Needs a sample of your export first; the mapping depends on its shape.

### Done when

`pnpm check` passes, the migration rebuilds from scratch, a reminder arrives on the phone, and the import has run against your real export.

## Phase 2: Email (outline; detailed plan after phase 1)

1. **Spike (go/no-go):** Deno IMAP client against Vimexx (connect, list folders, fetch UIDs and a body, set `\Flagged`). If it fails, use a Node worker in Docker instead.
2. **Schema:** `mail_folders` (cursor: `uidvalidity`, `last_uid`), `mail_messages` (full body, headers, thread key, class, importance), `mail_rules`, `todo_suggestions` (with source message and thread).
3. **Sync:** `pg_cron` runs `sync-mail`: a resumable, newest-first backfill (imported mail is never classified), then incremental polling.
4. **Classify:** bulk/newsletter detection and keyword rules first, then Haiku 5.5 on headers and the first 2–4k characters, with a JSON schema and no tools. A daily call cap and a cost estimate before any paid run.
5. **Outputs:** auto-flag important mail (`\Flagged`), batched push through `_shared/push.ts`, suggestions list (accept or dismiss, one todo per thread), "always ignore" and VIP rules learned from taps, a push if sync fails for 24 hours.
6. **Viewer:** folder list, message list, sanitized HTML in a WebView with remote images off, tap actions for move and mark read.

## Open before starting

- Is a Dashboard card plus a Meer row right for todo entry, or do you want a tab?
- Notion export format and where you'll drop it (gitignored path).
- Reminder behavior: one fixed `remind_at`, or also "on the due date at 09:00" by default?
