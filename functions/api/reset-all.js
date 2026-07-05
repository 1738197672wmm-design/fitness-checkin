// POST /api/reset-all - 清空所有数据（需管理员密码验证）
export async function onRequest(context) {
  const { request, env } = context
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }
  try {
    const { secret } = await request.json()
    if (secret !== 'admin2026') {
      return new Response(JSON.stringify({ error: '未授权' }), {
        status: 403, headers: { 'Content-Type': 'application/json' }
      })
    }
    await env.DB.prepare("DELETE FROM checkins").run();
    await env.DB.prepare("DELETE FROM feed").run();
    return new Response(JSON.stringify({ success: true, message: "所有数据已清空" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
}