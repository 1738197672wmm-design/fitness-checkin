// POST /api/login - 登录验证
const USERS = [
  { id: 'u1', username: '15608348607', password: 'zilvluoxiaodie', displayName: '罗小蝶', avatar: '/avatars/u1.jpg', joinDate: '2026-01-01' },
  { id: 'u2', username: '18306083726', password: 'zilvyuwenkai', displayName: '余汶锴', avatar: '/avatars/u2.jpg', joinDate: '2026-01-01' },
  { id: 'u3', username: '13004637102', password: 'zilvxuliuxia', displayName: '徐柳霞', avatar: '/avatars/u3.jpg', joinDate: '2026-01-01' },
  { id: 'u4', username: '15803667963', password: 'zilvlizhiwei', displayName: '黎芷玮', avatar: '/avatars/u4.jpg', joinDate: '2026-01-01' },
  { id: 'u5', username: '13254367845', password: 'zilvhuangyining', displayName: '黄毅宁', avatar: '/avatars/u5.jpg', joinDate: '2026-01-01' },
  { id: 'u6', username: '13983373167', password: 'zilvbaijinqiu', displayName: '白晋秋', avatar: '/avatars/u6.jpg', joinDate: '2026-01-01' },
  { id: 'u7', username: '15696304095', password: '20326454', displayName: '管理员', avatar: '/avatars/u7.jpg', joinDate: '2026-01-01', isAdmin: true },
]

export async function onRequest(context) {
  const { request } = context
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { username, password } = await request.json()
    const found = USERS.find(u => u.username === username && u.password === password)
    
    if (found) {
      const { password: _, ...safeUser } = found
      return new Response(JSON.stringify({ success: true, user: safeUser }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    return new Response(JSON.stringify({ success: false, error: '账号或密码错误' }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }
}
