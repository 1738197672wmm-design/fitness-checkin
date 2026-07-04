// 预设用户账号 - 由管理员分发给朋友
export const USERS = [
  { id: 'u1', username: 'admin', password: 'admin123', displayName: 'Admin', avatar: '🐉', joinDate: '2026-01-01' },
  { id: 'u2', username: 'alex', password: 'alex123', displayName: 'Alex', avatar: '🔥', joinDate: '2026-01-15' },
  { id: 'u3', username: 'bella', password: 'bella123', displayName: 'Bella', avatar: '💪', joinDate: '2026-02-01' },
  { id: 'u4', username: 'chen', password: 'chen123', displayName: '陈晨', avatar: '🏋️', joinDate: '2026-02-20' },
]

// 预设一些历史打卡数据
const today = new Date()
const genDate = (daysAgo) => {
  const d = new Date(today)
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

export const MOCK_CHECKINS = [
  // Admin
  { userId: 'u1', date: genDate(0), exerciseCount: 12, calories: 380, duration: 55 },
  { userId: 'u1', date: genDate(1), exerciseCount: 8, calories: 250, duration: 40 },
  { userId: 'u1', date: genDate(2), exerciseCount: 15, calories: 450, duration: 65 },
  { userId: 'u1', date: genDate(5), exerciseCount: 10, calories: 320, duration: 48 },
  { userId: 'u1', date: genDate(8), exerciseCount: 6, calories: 200, duration: 35 },
  { userId: 'u1', date: genDate(12), exerciseCount: 14, calories: 420, duration: 60 },
  { userId: 'u1', date: genDate(15), exerciseCount: 9, calories: 280, duration: 42 },
  { userId: 'u1', date: genDate(20), exerciseCount: 11, calories: 350, duration: 50 },
  { userId: 'u1', date: genDate(25), exerciseCount: 7, calories: 220, duration: 38 },
  // Alex
  { userId: 'u2', date: genDate(0), exerciseCount: 10, calories: 310, duration: 45 },
  { userId: 'u2', date: genDate(1), exerciseCount: 14, calories: 430, duration: 62 },
  { userId: 'u2', date: genDate(2), exerciseCount: 6, calories: 180, duration: 30 },
  { userId: 'u2', date: genDate(3), exerciseCount: 11, calories: 340, duration: 50 },
  { userId: 'u2', date: genDate(6), exerciseCount: 8, calories: 260, duration: 40 },
  { userId: 'u2', date: genDate(10), exerciseCount: 13, calories: 400, duration: 58 },
  { userId: 'u2', date: genDate(14), exerciseCount: 9, calories: 290, duration: 44 },
  { userId: 'u2', date: genDate(18), exerciseCount: 12, calories: 370, duration: 52 },
  { userId: 'u2', date: genDate(22), exerciseCount: 7, calories: 210, duration: 36 },
  { userId: 'u2', date: genDate(28), exerciseCount: 15, calories: 460, duration: 68 },
  // Bella
  { userId: 'u3', date: genDate(0), exerciseCount: 9, calories: 270, duration: 42 },
  { userId: 'u3', date: genDate(1), exerciseCount: 11, calories: 340, duration: 50 },
  { userId: 'u3', date: genDate(3), exerciseCount: 7, calories: 220, duration: 35 },
  { userId: 'u3', date: genDate(5), exerciseCount: 13, calories: 400, duration: 58 },
  { userId: 'u3', date: genDate(7), exerciseCount: 5, calories: 160, duration: 28 },
  { userId: 'u3', date: genDate(11), exerciseCount: 10, calories: 310, duration: 46 },
  { userId: 'u3', date: genDate(16), exerciseCount: 8, calories: 250, duration: 38 },
  { userId: 'u3', date: genDate(21), exerciseCount: 14, calories: 430, duration: 62 },
  { userId: 'u3', date: genDate(26), exerciseCount: 6, calories: 190, duration: 32 },
  // Chen
  { userId: 'u4', date: genDate(0), exerciseCount: 16, calories: 500, duration: 72 },
  { userId: 'u4', date: genDate(1), exerciseCount: 12, calories: 380, duration: 55 },
  { userId: 'u4', date: genDate(2), exerciseCount: 10, calories: 320, duration: 48 },
  { userId: 'u4', date: genDate(4), exerciseCount: 14, calories: 440, duration: 64 },
  { userId: 'u4', date: genDate(6), exerciseCount: 8, calories: 250, duration: 40 },
  { userId: 'u4', date: genDate(9), exerciseCount: 11, calories: 350, duration: 50 },
  { userId: 'u4', date: genDate(13), exerciseCount: 9, calories: 280, duration: 42 },
  { userId: 'u4', date: genDate(17), exerciseCount: 13, calories: 410, duration: 58 },
  { userId: 'u4', date: genDate(23), exerciseCount: 7, calories: 220, duration: 36 },
  { userId: 'u4', date: genDate(29), exerciseCount: 15, calories: 470, duration: 68 },
]

// 预设一些动态（好友打卡后的动态）
export const MOCK_FEED = [
  { id: 'f1', userId: 'u4', type: 'checkin', exerciseName: 'Barbell Bench Press', calories: 120, duration: 12, timestamp: new Date(Date.now() - 1800000).toISOString() },
  { id: 'f2', userId: 'u2', type: 'checkin', exerciseName: 'Dumbbell Curl', calories: 80, duration: 8, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'f3', userId: 'u1', type: 'checkin', exerciseName: 'Deadlift', calories: 150, duration: 15, timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 'f4', userId: 'u3', type: 'checkin', exerciseName: 'Plank', calories: 60, duration: 10, timestamp: new Date(Date.now() - 14400000).toISOString() },
  { id: 'f5', userId: 'u4', type: 'checkin', exerciseName: 'Pull-Up', calories: 100, duration: 10, timestamp: new Date(Date.now() - 28800000).toISOString() },
  { id: 'f6', userId: 'u2', type: 'milestone', text: '连续打卡 7 天！🎉', timestamp: new Date(Date.now() - 43200000).toISOString() },
  { id: 'f7', userId: 'u1', type: 'checkin', exerciseName: 'Squat', calories: 130, duration: 14, timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'f8', userId: 'u3', type: 'checkin', exerciseName: 'Lateral Raise', calories: 70, duration: 8, timestamp: new Date(Date.now() - 100800000).toISOString() },
]