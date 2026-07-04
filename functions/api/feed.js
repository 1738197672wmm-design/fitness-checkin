// GET /api/feed - 获取好友动态
export async function onRequest(context) {
  const { request, env } = context

  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM feed ORDER BY timestamp DESC LIMIT 50'
    ).all()

    return new Response(JSON.stringify({ feed: results }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }
}
