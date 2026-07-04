// GET /api/rankings?metric=calories - 获取排行榜
export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const metric = url.searchParams.get('metric') || 'calories'

  try {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

    const { results } = await env.DB.prepare(
      `SELECT userId, COALESCE(SUM(exerciseCount),0) as exercises, COALESCE(SUM(calories),0) as calories, COALESCE(SUM(duration),0) as duration
       FROM checkins WHERE date >= ? GROUP BY userId ORDER BY ${metric} DESC`
    ).bind(monthStart).all()

    return new Response(JSON.stringify({ rankings: results }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }
}
