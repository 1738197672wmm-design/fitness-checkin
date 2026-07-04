// POST /api/setup - ????????????????
const MOCK_CHECKINS = [
  { userId: 'u1', daysAgo: 0, exerciseType: 'cardio', calories: 300, duration: 45 },
  { userId: 'u1', daysAgo: 1, exerciseType: 'strength', calories: 240, duration: 35 },
  { userId: 'u1', daysAgo: 3, exerciseType: 'cardio', calories: 360, duration: 50 },
  { userId: 'u2', daysAgo: 0, exerciseType: 'strength', calories: 380, duration: 55 },
  { userId: 'u2', daysAgo: 2, exerciseType: 'cardio', calories: 280, duration: 42 },
  { userId: 'u2', daysAgo: 4, exerciseType: 'strength', calories: 450, duration: 65 },
  { userId: 'u3', daysAgo: 0, exerciseType: 'cardio', calories: 250, duration: 40 },
  { userId: 'u3', daysAgo: 1, exerciseType: 'strength', calories: 420, duration: 60 },
  { userId: 'u3', daysAgo: 5, exerciseType: 'cardio', calories: 320, duration: 48 },
  { userId: 'u4', daysAgo: 0, exerciseType: 'strength', calories: 460, duration: 68 },
  { userId: 'u4', daysAgo: 2, exerciseType: 'cardio', calories: 340, duration: 50 },
  { userId: 'u4', daysAgo: 6, exerciseType: 'strength', calories: 400, duration: 58 },
  { userId: 'u5', daysAgo: 0, exerciseType: 'cardio', calories: 180, duration: 30 },
  { userId: 'u5', daysAgo: 1, exerciseType: 'strength', calories: 270, duration: 42 },
  { userId: 'u5', daysAgo: 3, exerciseType: 'cardio', calories: 220, duration: 35 },
  { userId: 'u6', daysAgo: 0, exerciseType: 'strength', calories: 350, duration: 52 },
  { userId: 'u6', daysAgo: 2, exerciseType: 'cardio', calories: 260, duration: 40 },
  { userId: 'u6', daysAgo: 4, exerciseType: 'strength', calories: 310, duration: 46 },
  { userId: 'u7', daysAgo: 0, exerciseType: 'strength', calories: 600, duration: 90 },
  { userId: 'u7', daysAgo: 1, exerciseType: 'cardio', calories: 500, duration: 75 },
  { userId: 'u7', daysAgo: 3, exerciseType: 'strength', calories: 550, duration: 80 },
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
        'INSERT OR IGNORE INTO checkins (userId, date, exerciseType, calories, duration) VALUES (?, ?, ?, ?, ?)'
      ).bind(userId, dateStr, c.exerciseType, c.calories, c.duration).run()
    }

    // Insert mock feed
    const feedItems = [
      { userId: 'u4', type: 'checkin', exerciseName: '无氧力量训练', calories: 120, duration: 12 },
      { userId: 'u2', type: 'checkin', exerciseName: '无氧力量训练', calories: 150, duration: 15 },
      { userId: 'u7', type: 'checkin', exerciseName: '无氧力量训练', calories: 200, duration: 20 },
      { userId: 'u3', type: 'checkin', exerciseName: '无氧力量训练', calories: 80, duration: 8 },
      { userId: 'u1', type: 'checkin', exerciseName: '有氧心率训练', calories: 100, duration: 10 },
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
