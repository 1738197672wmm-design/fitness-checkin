CREATE TABLE IF NOT EXISTS checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  date TEXT NOT NULL,
  exerciseType TEXT DEFAULT 'strength',
  calories INTEGER DEFAULT 0,
  duration INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT (datetime('now')),
  UNIQUE(userId, date)
);

CREATE TABLE IF NOT EXISTS feed (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  type TEXT NOT NULL,
  text TEXT,
  exerciseName TEXT,
  calories INTEGER DEFAULT 0,
  duration INTEGER DEFAULT 0,
  timestamp TEXT NOT NULL,
  createdAt TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_checkins_userId ON checkins(userId);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON checkins(date);
CREATE INDEX IF NOT EXISTS idx_feed_timestamp ON feed(timestamp DESC);
