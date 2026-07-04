// GET /api/checkins?userId=xxx - 获取用户的打卡记录
export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const userId = url.searchParams.get('userId')

  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const { results } = await env.DB.prepare(
      'SELECT date, exerciseType, calories, duration FROM checkins WHERE userId = ? ORDER BY date DESC'
    ).bind(userId).all()

    // Get today's checkin
    const today = new Date().toISOString().split('T')[0]
    const todayCheckin = results.find(r => r.date === today) || null

    return new Response(JSON.stringify({ checkins: results, todayCheckin }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }
}
