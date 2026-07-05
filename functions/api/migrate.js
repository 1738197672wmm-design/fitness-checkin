
// GET /api/migrate - ?? checkins ??????????
export async function onRequest(context) {
  const { env } = context
  try {
    // Check current table structure
    const { results } = await env.DB.prepare("PRAGMA table_info(checkins)").all();
    const columns = results.map(r => r.name);
    const hasExerciseType = columns.includes("exerciseType");

    if (hasExerciseType) {
      // ExerciseType exists - just check for UNIQUE constraint
      await env.DB.prepare(
        "INSERT INTO checkins (userId, date, exerciseType, calories, duration) VALUES (?, ?, ?, ?, ?)"
      ).bind("_migrate_test", "2000-01-01", "strength", 0, 0).run();

      try {
        await env.DB.prepare(
          "INSERT INTO checkins (userId, date, exerciseType, calories, duration) VALUES (?, ?, ?, ?, ?)"
        ).bind("_migrate_test", "2000-01-01", "cardio", 0, 0).run();
        await env.DB.prepare("DELETE FROM checkins WHERE userId = ?").bind("_migrate_test").run();
        return new Response(JSON.stringify({ success: true, message: "????" }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (e2) {
        // Has UNIQUE constraint - migrate
        await env.DB.prepare("DELETE FROM checkins WHERE userId = ?").bind("_migrate_test").run();
        await env.DB.prepare("ALTER TABLE checkins RENAME TO checkins_old").run();
        await env.DB.prepare(
          "CREATE TABLE checkins (id INTEGER PRIMARY KEY AUTOINCREMENT, userId TEXT NOT NULL, date TEXT NOT NULL, exerciseType TEXT DEFAULT 'strength', calories INTEGER DEFAULT 0, duration INTEGER DEFAULT 0, createdAt TEXT DEFAULT (datetime('now')))"
        ).run();
        await env.DB.prepare("INSERT INTO checkins (userId, date, exerciseType, calories, duration, createdAt) SELECT userId, date, exerciseType, calories, duration, createdAt FROM checkins_old").run();
        await env.DB.prepare("DROP TABLE checkins_old").run();
        return new Response(JSON.stringify({ success: true, message: "UNIQUE ?????" }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    } else {
      // Table doesn't have exerciseType - recreate entirely
      await env.DB.prepare("ALTER TABLE checkins RENAME TO checkins_old").run();
      await env.DB.prepare(
        "CREATE TABLE checkins (id INTEGER PRIMARY KEY AUTOINCREMENT, userId TEXT NOT NULL, date TEXT NOT NULL, exerciseType TEXT DEFAULT 'strength', calories INTEGER DEFAULT 0, duration INTEGER DEFAULT 0, createdAt TEXT DEFAULT (datetime('now')))"
      ).run();
      // Try to copy if old table has compatible columns
      try {
        await env.DB.prepare("INSERT INTO checkins (userId, date, calories, duration, createdAt) SELECT userId, date, calories, duration, createdAt FROM checkins_old").run();
      } catch (copyErr) {
        // ignore copy errors
      }
      await env.DB.prepare("DROP TABLE checkins_old").run();
      return new Response(JSON.stringify({ success: true, message: "?????????? exerciseType ?" }), {
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
}
