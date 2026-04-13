-- Run this migration to add missing columns to your existing tables

-- ── events table ───────────────────────────────────────────────────────────
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS location        TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS color           VARCHAR(20) DEFAULT 'blue',
  ADD COLUMN IF NOT EXISTS recurrence      VARCHAR(50) DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS visibility      VARCHAR(20) DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS status          VARCHAR(20) DEFAULT 'confirmed',
  ADD COLUMN IF NOT EXISTS all_day         BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS meet_link       TEXT,
  ADD COLUMN IF NOT EXISTS organizer       TEXT,
  ADD COLUMN IF NOT EXISTS attendees       TEXT,
  ADD COLUMN IF NOT EXISTS updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Unique constraint needed for ON CONFLICT upsert
ALTER TABLE events
  DROP CONSTRAINT IF EXISTS events_google_event_id_key;
ALTER TABLE events
  ADD CONSTRAINT events_google_event_id_key UNIQUE (google_event_id);

-- ── reminders table ─────────────────────────────────────────────────────────
ALTER TABLE reminders
  ADD COLUMN IF NOT EXISTS recurrence      VARCHAR(50) DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update status constraint to allow 'paused'
ALTER TABLE reminders
  DROP CONSTRAINT IF EXISTS reminders_status_check;
ALTER TABLE reminders
  ADD CONSTRAINT reminders_status_check
    CHECK (status IN ('pending', 'paused', 'completed'));

-- ── If tables don't exist yet, create them from scratch ─────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  google_id     VARCHAR(255) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  name          VARCHAR(255),
  avatar_url    TEXT,
  refresh_token TEXT,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER REFERENCES users(id) ON DELETE CASCADE,
  google_event_id  VARCHAR(255) UNIQUE,
  title            VARCHAR(500) NOT NULL,
  description      TEXT DEFAULT '',
  start_time       TIMESTAMP WITH TIME ZONE,
  end_time         TIMESTAMP WITH TIME ZONE,
  location         TEXT DEFAULT '',
  color            VARCHAR(20) DEFAULT 'blue',
  recurrence       VARCHAR(50) DEFAULT 'none',
  visibility       VARCHAR(20) DEFAULT 'default',
  status           VARCHAR(20) DEFAULT 'confirmed',
  all_day          BOOLEAN DEFAULT FALSE,
  meet_link        TEXT,
  organizer        TEXT,
  attendees        TEXT,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reminders (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  event_id    INTEGER REFERENCES events(id) ON DELETE SET NULL,
  remind_at   TIMESTAMP WITH TIME ZONE NOT NULL,
  message     TEXT NOT NULL,
  recurrence  VARCHAR(50) DEFAULT 'none',
  status      VARCHAR(20) DEFAULT 'pending'
                CHECK (status IN ('pending', 'paused', 'completed')),
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_user_id    ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_status  ON reminders(status);
CREATE INDEX IF NOT EXISTS idx_reminders_remind_at ON reminders(remind_at);