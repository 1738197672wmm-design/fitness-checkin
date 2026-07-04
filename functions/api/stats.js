// GET /api/stats?userId=xxx&range=week|month - 获取统计数据
export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const userId = url.searchParams.get('userId')
  const range = url.searchParams.get('range') || 'week'

  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const now = new Date()
    let since
    if (range === 'month') {
      since = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    } else {
      const weekAgo = new Date(now)
      weekAgo.setDate(weekAgo.getDate() - 7)
      since = weekAgo.toISOString().split('T')[0]
    }

    const row = await env.DB.prepare(
      'SELECT COALESCE(SUM(calories),0) as calories, COALESCE(SUM(duration),0) as duration FROM checkins WHERE userId = ? AND date >= ?'
    ).bind(userId, since).first()

    return new Response(JSON.stringify(row), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }
}
