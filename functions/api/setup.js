// POST /api/setup - 初始化用户数据（首次登录时调用）
const MOCK_CHECKINS = [
  { userId: 'u1', daysAgo: 0, exerciseCount: 10, calories: 300, duration: 45 },
  { userId: 'u1', daysAgo: 1, exerciseCount: 8, calories: 240, duration: 35 },
  { userId: 'u1', daysAgo: 3, exerciseCount: 12, calories: 360, duration: 50 },
  { userId: 'u2', daysAgo: 0, exerciseCount: 12, calories: 380, duration: 55 },
  { userId: 'u2', daysAgo: 2, exerciseCount: 9, calories: 280, duration: 42 },
  { userId: 'u2', daysAgo: 4, exerciseCount: 15, calories: 450, duration: 65 },
  { userId: 'u3', daysAgo: 0, exerciseCount: 8, calories: 250, duration: 40 },
  { userId: 'u3', daysAgo: 1, exerciseCount: 14, calories: 420, duration: 60 },
  { userId: 'u3', daysAgo: 5, exerciseCount: 10, calories: 320, duration: 48 },
  { userId: 'u4', daysAgo: 0, exerciseCount: 15, calories: 460, duration: 68 },
  { userId: 'u4', daysAgo: 2, exerciseCount: 11, calories: 340, duration: 50 },
  { userId: 'u4', daysAgo: 6, exerciseCount: 13, calories: 400, duration: 58 },
  { userId: 'u5', daysAgo: 0, exerciseCount: 6, calories: 180, duration: 30 },
  { userId: 'u5', daysAgo: 1, exerciseCount: 9, calories: 270, duration: 42 },
  { userId: 'u5', daysAgo: 3, exerciseCount: 7, calories: 220, duration: 35 },
  { userId: 'u6', daysAgo: 0, exerciseCount: 11, calories: 350, duration: 52 },
  { userId: 'u6', daysAgo: 2, exerciseCount: 8, calories: 260, duration: 40 },
  { userId: 'u6', daysAgo: 4, exerciseCount: 10, calories: 310, duration: 46 },
  { userId: 'u7', daysAgo: 0, exerciseCount: 20, calories: 600, duration: 90 },
  { userId: 'u7', daysAgo: 1, exerciseCount: 16, calories: 500, duration: 75 },
  { userId: 'u7', daysAgo: 3, exerciseCount: 18, calories: 550, duration: 80 },
]

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

    // Check if user already has data
    const existing = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM checkins WHERE userId = ?'
    ).bind(userId).first()

    if (existing.count > 0) {
      return new Response(JSON.stringify({ success: true, message: 'already initialized' }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Insert mock data
    const userCheckins = MOCK_CHECKINS.filter(c => c.userId === userId)
    const today = new Date()

    for (const c of userCheckins) {
      const d = new Date(today)
      d.setDate(d.getDate() - c.daysAgo)
      const dateStr = d.toISOString().split('T')[0]

      await env.DB.prepare(
        'INSERT OR IGNORE INTO checkins (userId, date, exerciseCount, calories, duration) VALUES (?, ?, ?, ?, ?)'
      ).bind(userId, dateStr, c.exerciseCount, c.calories, c.duration).run()
    }

    // Insert mock feed
    const feedItems = [
      { userId: 'u4', type: 'checkin', exerciseName: 'Barbell Bench Press', calories: 120, duration: 12 },
      { userId: 'u2', type: 'checkin', exerciseName: 'Deadlift', calories: 150, duration: 15 },
      { userId: 'u7', type: 'checkin', exerciseName: 'Squat', calories: 200, duration: 20 },
      { userId: 'u3', type: 'checkin', exerciseName: 'Dumbbell Curl', calories: 80, duration: 8 },
      { userId: 'u1', type: 'checkin', exerciseName: 'Pull-Up', calories: 100, duration: 10 },
    ]

    for (const f of feedItems) {
      const ts = new Date(Date.now() - (feedItems.indexOf(f) + 1) * 3600000).toISOString()
      await env.DB.prepare(
        'INSERT INTO feed (userId, type, exerciseName, calories, duration, timestamp) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(f.userId, f.type, f.exerciseName, f.calories, f.duration, ts).run()
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
