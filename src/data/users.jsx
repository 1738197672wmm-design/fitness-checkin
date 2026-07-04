// 用户账号 - 由管理员分配
export const USERS = [
  { id: 'u1', username: '15608348607', password: 'zilvluoxiaodie', displayName: '罗小蝶', avatar: '🦋', joinDate: '2026-01-01' },
  { id: 'u2', username: '18306083726', password: 'zilvyuwenkai', displayName: '余汶锴', avatar: '⚡', joinDate: '2026-01-01' },
  { id: 'u3', username: '13004637102', password: 'zilvxuliuxia', displayName: '徐柳霞', avatar: '🌊', joinDate: '2026-01-01' },
  { id: 'u4', username: '15803667963', password: 'zilvlizhiwei', displayName: '黎芷玮', avatar: '🏋️', joinDate: '2026-01-01' },
  { id: 'u5', username: '13254367845', password: 'zilvhuangyining', displayName: '黄毅宁', avatar: '🌸', joinDate: '2026-01-01' },
  { id: 'u6', username: '13983373167', password: 'zilvbaijinqiu', displayName: '白晋秋', avatar: '🌙', joinDate: '2026-01-01' },
  { id: 'u7', username: '15696304095', password: '20326454', displayName: '管理员', avatar: '🐉', joinDate: '2026-01-01', isAdmin: true },
]

// 预设一些历史打卡数据（新用户初始数据，让排行榜不空）
const today = new Date()
const genDate = (daysAgo) => {
  const d = new Date(today)
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

export const MOCK_CHECKINS = [
  { userId: 'u1', date: genDate(0), exerciseCount: 10, calories: 300, duration: 45 },
  { userId: 'u1', date: genDate(1), exerciseCount: 8, calories: 240, duration: 35 },
  { userId: 'u1', date: genDate(3), exerciseCount: 12, calories: 360, duration: 50 },
  { userId: 'u2', date: genDate(0), exerciseCount: 12, calories: 380, duration: 55 },
  { userId: 'u2', date: genDate(2), exerciseCount: 9, calories: 280, duration: 42 },
  { userId: 'u2', date: genDate(4), exerciseCount: 15, calories: 450, duration: 65 },
  { userId: 'u3', date: genDate(0), exerciseCount: 8, calories: 250, duration: 40 },
  { userId: 'u3', date: genDate(1), exerciseCount: 14, calories: 420, duration: 60 },
  { userId: 'u3', date: genDate(5), exerciseCount: 10, calories: 320, duration: 48 },
  { userId: 'u4', date: genDate(0), exerciseCount: 15, calories: 460, duration: 68 },
  { userId: 'u4', date: genDate(2), exerciseCount: 11, calories: 340, duration: 50 },
  { userId: 'u4', date: genDate(6), exerciseCount: 13, calories: 400, duration: 58 },
  { userId: 'u5', date: genDate(0), exerciseCount: 6, calories: 180, duration: 30 },
  { userId: 'u5', date: genDate(1), exerciseCount: 9, calories: 270, duration: 42 },
  { userId: 'u5', date: genDate(3), exerciseCount: 7, calories: 220, duration: 35 },
  { userId: 'u6', date: genDate(0), exerciseCount: 11, calories: 350, duration: 52 },
  { userId: 'u6', date: genDate(2), exerciseCount: 8, calories: 260, duration: 40 },
  { userId: 'u6', date: genDate(4), exerciseCount: 10, calories: 310, duration: 46 },
  { userId: 'u7', date: genDate(0), exerciseCount: 20, calories: 600, duration: 90 },
  { userId: 'u7', date: genDate(1), exerciseCount: 16, calories: 500, duration: 75 },
  { userId: 'u7', date: genDate(3), exerciseCount: 18, calories: 550, duration: 80 },
]

// 预设一些好友动态
export const MOCK_FEED = [
  { id: 'f1', userId: 'u4', type: 'checkin', exerciseName: 'Barbell Bench Press', calories: 120, duration: 12, timestamp: new Date(Date.now() - 1800000).toISOString() },
  { id: 'f2', userId: 'u2', type: 'checkin', exerciseName: 'Deadlift', calories: 150, duration: 15, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'f3', userId: 'u7', type: 'checkin', exerciseName: 'Squat', calories: 200, duration: 20, timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 'f4', userId: 'u3', type: 'checkin', exerciseName: 'Dumbbell Curl', calories: 80, duration: 8, timestamp: new Date(Date.now() - 14400000).toISOString() },
  { id: 'f5', userId: 'u1', type: 'checkin', exerciseName: 'Pull-Up', calories: 100, duration: 10, timestamp: new Date(Date.now() - 28800000).toISOString() },
  { id: 'f6', userId: 'u5', type: 'milestone', text: '首次打卡！🎉', timestamp: new Date(Date.now() - 43200000).toISOString() },
  { id: 'f7', userId: 'u6', type: 'checkin', exerciseName: 'Plank', calories: 60, duration: 10, timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'f8', userId: 'u4', type: 'checkin', exerciseName: 'Lateral Raise', calories: 70, duration: 8, timestamp: new Date(Date.now() - 100800000).toISOString() },
]
