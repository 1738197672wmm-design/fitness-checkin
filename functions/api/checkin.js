// POST /api/checkin - 提交打卡（每天最多3次）
export async function onRequest(context) {
  const { request, env } = context
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { userId, exerciseType, calories, duration } = await request.json()
    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      })
    }

    const today = new Date().toISOString().split('T')[0]
    const eType = exerciseType === 'cardio' ? 'cardio' : 'strength'

    // Count today's checkins
    const row = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM checkins WHERE userId = ? AND date = ?'
    ).bind(userId, today).first()

    if (row.count >= 3) {
      return new Response(JSON.stringify({ success: false, error: '今天已打卡3次，已达上限' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      })
    }

    // Insert new checkin (each submission = one row)
    await env.DB.prepare(
      'INSERT INTO checkins (userId, date, exerciseType, calories, duration) VALUES (?, ?, ?, ?, ?)'
    ).bind(userId, today, eType, calories || 0, duration || 0).run()

    // Add to feed
    const now = new Date().toISOString()
    const typeLabel = eType === 'cardio' ? '有氧训练' : '力量训练'
    await env.DB.prepare(
      'INSERT INTO feed (userId, type, exerciseName, calories, duration, timestamp) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(userId, 'checkin', typeLabel, calories || 0, duration || 0, now).run()

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }
}
