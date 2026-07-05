// GET /api/reset-all - 清空所有打卡和动态数据
export async function onRequest(context) {
  const { env } = context
  try {
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
