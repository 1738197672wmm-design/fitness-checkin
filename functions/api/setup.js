// POST /api/setup - 当前仅用于表结构迁潟，不再插入默认数据
export async function onRequest(context) {
  const { request, env } = context
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { userId } = await request.json()
    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      })
    }

    // Migration: ensure checkins table has correct structure
    try {
      const { results } = await env.DB.prepare("PRAGMA table_info(checkins)").all();
      const columns = results.map(r => r.name);

      if (!columns.includes("exerciseType")) {
        await env.DB.prepare("ALTER TABLE checkins RENAME TO checkins_old").run();
        await env.DB.prepare(
          "CREATE TABLE checkins (id INTEGER PRIMARY KEY AUTOINCREMENT, userId TEXT NOT NULL, date TEXT NOT NULL, exerciseType TEXT DEFAULT 'strength', calories INTEGER DEFAULT 0, duration INTEGER DEFAULT 0, createdAt TEXT DEFAULT (datetime('now')))"
        ).run();
        try {
          await env.DB.prepare("INSERT INTO checkins (userId, date, calories, duration, createdAt) SELECT userId, date, calories, duration, createdAt FROM checkins_old").run();
        } catch (copyErr) {}
        await env.DB.prepare("DROP TABLE checkins_old").run();
      } else {
        await env.DB.prepare(
          'INSERT INTO checkins (userId, date, exerciseType, calories, duration) VALUES (?, ?, ?, ?, ?)'
        ).bind('_migrate_test', '2000-01-01', 'strength', 0, 0).run();
        try {
          await env.DB.prepare(
            'INSERT INTO checkins (userId, date, exerciseType, calories, duration) VALUES (?, ?, ?, ?, ?)'
          ).bind('_migrate_test', '2000-01-01', 'cardio', 0, 0).run();
          await env.DB.prepare('DELETE FROM checkins WHERE userId = ?').bind('_migrate_test').run();
        } catch (e2) {
          await env.DB.prepare('DELETE FROM checkins WHERE userId = ?').bind('_migrate_test').run();
          await env.DB.prepare('ALTER TABLE checkins RENAME TO checkins_old').run();
          await env.DB.prepare(
            "CREATE TABLE checkins (id INTEGER PRIMARY KEY AUTOINCREMENT, userId TEXT NOT NULL, date TEXT NOT NULL, exerciseType TEXT DEFAULT 'strength', calories INTEGER DEFAULT 0, duration INTEGER DEFAULT 0, createdAt TEXT DEFAULT (datetime('now')))"
          ).run();
          await env.DB.prepare('INSERT INTO checkins (userId, date, exerciseType, calories, duration, createdAt) SELECT userId, date, exerciseType, calories, duration, createdAt FROM checkins_old').run();
          await env.DB.prepare('DROP TABLE checkins_old').run();
        }
      }
    } catch (e) {
      // table may not exist yet, that's fine
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }
}
