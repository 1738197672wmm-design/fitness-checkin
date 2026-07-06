// GET /api/checkins?userId=xxx - ��ȡ�û��Ĵ򿨼�¼
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
      'SELECT date, exerciseType, calories, duration FROM checkins WHERE userId = ? ORDER BY date DESC, id DESC'
    ).bind(userId).all()

    // Get today's stats (summed)
    const today = new Date(Date.now() + 28800000).toISOString().split('T')[0]
    const todayRows = results.filter(r => r.date === today)
    const todayCheckin = todayRows.length > 0 ? {
      calories: todayRows.reduce((s, r) => s + r.calories, 0),
      duration: todayRows.reduce((s, r) => s + r.duration, 0),
      exerciseType: todayRows[0].exerciseType,
    } : null

    return new Response(JSON.stringify({
      checkins: results,
      todayCheckin,
      todayCount: todayRows.length
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }
}
