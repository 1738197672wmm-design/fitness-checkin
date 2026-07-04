import { useState, useEffect } from 'react'
import { initAllAnimations } from '../utils/animations'
import { useAuth } from '../contexts/AuthContext'
import { useCheckin } from '../hooks/useCheckin'
import './DashboardPage.css'

function DashboardPage() {
  useEffect(() => { const timer = setTimeout(initAllAnimations, 100); return () => clearTimeout(timer) }, [])
  const { user } = useAuth()
  const { todayCheckin, userCheckins, addCheckin, getWeekStats, getFeed } = useCheckin()
  const [activeTab, setActiveTab] = useState('checkin')
  const [checkinForm, setCheckinForm] = useState({ exerciseName: '', exerciseCount: 1, calories: 0, duration: 0 })

  const weekStats = getWeekStats(user?.id)

  const handleAddCheckin = (e) => {
    e.preventDefault()
    if (!checkinForm.exerciseName.trim()) return
    addCheckin(
      checkinForm.exerciseName.trim(),
      Number(checkinForm.exerciseCount) || 1,
      Number(checkinForm.calories) || 0,
      Number(checkinForm.duration) || 0
    )
    setCheckinForm({ exerciseName: '', exerciseCount: 1, calories: 0, duration: 0 })
  }

  const quickCheckin = (exerciseName, exerciseCount, calories, duration) => {
    addCheckin(exerciseName, exerciseCount, calories, duration)
  }

  const feedItems = getFeed()

  return (
    <div className='dashboard-page'>
      <div className='container'>
        <div className='dashboard-welcome'>
          <div className='welcome-avatar'>{user?.avatar}</div>
          <div>
            <h2 className='welcome-title'>你好，{user?.displayName} 💪</h2>
            <p className='welcome-subtitle'>今天也要坚持锻炼哦！</p>
          </div>
        </div>

        <div className='dashboard-today'>
          <div className='today-card'>
            <div className='today-icon'>🏋️</div>
            <div className='today-value'>{todayCheckin?.exerciseCount || 0}</div>
            <div className='today-label'>今日打卡组数</div>
          </div>
          <div className='today-card'>
            <div className='today-icon'>🔥</div>
            <div className='today-value'>{todayCheckin?.calories || 0}</div>
            <div className='today-label'>消耗热量 (kcal)</div>
          </div>
          <div className='today-card'>
            <div className='today-icon'>⏱️</div>
            <div className='today-value'>{todayCheckin?.duration || 0}m</div>
            <div className='today-label'>运动时长 (分钟)</div>
          </div>
        </div>

        <div className='checkin-form-card'>
          <h3 className='cf-title'>⚡ 快速打卡</h3>
          <form onSubmit={handleAddCheckin} className='checkin-form'>
            <div className='cf-row'>
              <input type='text' placeholder='练了什么动作？例如：深蹲、卧推...' value={checkinForm.exerciseName} onChange={e => setCheckinForm(p => ({ ...p, exerciseName: e.target.value }))} className='cf-input cf-input-name' />
              <input type='number' min='1' max='50' placeholder='组数' value={checkinForm.exerciseCount} onChange={e => setCheckinForm(p => ({ ...p, exerciseCount: e.target.value }))} className='cf-input cf-input-sm' />
              <input type='number' min='0' max='5000' placeholder='kcal' value={checkinForm.calories} onChange={e => setCheckinForm(p => ({ ...p, calories: e.target.value }))} className='cf-input cf-input-sm' />
              <input type='number' min='0' max='600' placeholder='分钟' value={checkinForm.duration} onChange={e => setCheckinForm(p => ({ ...p, duration: e.target.value }))} className='cf-input cf-input-sm' />
              <button type='submit' className='btn-cf-submit'>打卡</button>
            </div>
          </form>
          <div className='cf-quick'>
            <span className='cf-quick-label'>快速打卡：</span>
            <button onClick={() => quickCheckin('深蹲', 3, 45, 8)} className='btn-quick'>🏋️ 深蹲</button>
            <button onClick={() => quickCheckin('俯卧撑', 3, 30, 5)} className='btn-quick'>💪 俯卧撑</button>
            <button onClick={() => quickCheckin('平板支撑', 1, 20, 3)} className='btn-quick'>⏱️ 平板支撑</button>
            <button onClick={() => quickCheckin('跑步', 1, 200, 25)} className='btn-quick'>🏃 跑步</button>
          </div>
        </div>

        <div className='dashboard-week-summary'>
          <h3 className='ws-title'>本周统计</h3>
          <div className='ws-bars'>
            <div className='ws-bar-item'>
              <div className='ws-bar-label'>组数</div>
              <div className='ws-bar-track'>
                <div className='ws-bar-fill' style={{ width: Math.min(100, (weekStats.exercises / 100) * 100) + '%' }}>
                  <span>{weekStats.exercises}</span>
                </div>
              </div>
            </div>
            <div className='ws-bar-item'>
              <div className='ws-bar-label'>热量</div>
              <div className='ws-bar-track'>
                <div className='ws-bar-fill warm' style={{ width: Math.min(100, (weekStats.calories / 3000) * 100) + '%' }}>
                  <span>{weekStats.calories} kcal</span>
                </div>
              </div>
            </div>
            <div className='ws-bar-item'>
              <div className='ws-bar-label'>时长</div>
              <div className='ws-bar-track'>
                <div className='ws-bar-fill cool' style={{ width: Math.min(100, (weekStats.duration / 600) * 100) + '%' }}>
                  <span>{weekStats.duration} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='dashboard-tabs'>
          <button className={'tab-btn' + (activeTab === 'checkin' ? ' active' : '')} onClick={() => setActiveTab('checkin')}>我的打卡</button>
          <button className={'tab-btn' + (activeTab === 'feed' ? ' active' : '')} onClick={() => setActiveTab('feed')}>好友动态</button>
        </div>

        {activeTab === 'checkin' ? (
          <div className='checkin-history'>
            {userCheckins.length > 0 ? (
              <div className='history-table'>
                <div className='table-header'>
                  <span>日期</span>
                  <span>打卡组数</span>
                  <span>热量 (kcal)</span>
                  <span>时长 (min)</span>
                </div>
                {userCheckins.map((checkin, i) => {
                  const isToday = checkin.date === new Date().toISOString().split('T')[0]
                  return (
                    <div key={i} className={'table-row' + (isToday ? ' today' : '')}>
                      <span className='cell-date'>{checkin.date}{isToday ? ' (今天)' : ''}</span>
                      <span className='cell-count'>{checkin.exerciseCount}</span>
                      <span className='cell-calories'>{checkin.calories}</span>
                      <span className='cell-duration'>{checkin.duration}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className='exercises-empty'>
                <div className='empty-icon'>📝</div>
                <h3>还没有打卡记录</h3>
                <p>开始你的第一次打卡吧！</p>
              </div>
            )}
          </div>
        ) : (
          <div className='friend-feed'>
            {feedItems.length > 0 ? feedItems.map(item => {
              const friend = item.userInfo
              return (
                <div key={item.id} className='feed-item'>
                  <div className='feed-avatar'>{friend?.avatar}</div>
                  <div className='feed-content'>
                    <div className='feed-header'>
                      <span className='feed-name'>{friend?.displayName}</span>
                      <span className='feed-time'>{timeAgo(item.timestamp)}</span>
                    </div>
                    {item.type === 'checkin' ? (
                      <p className='feed-text'>
                        完成了 <strong>{item.exerciseName}</strong>
                        {' · '}🔥 {item.calories} kcal · ⏱️ {item.duration} min
                      </p>
                    ) : item.type === 'milestone' ? (
                      <p className='feed-milestone'>{item.text}</p>
                    ) : null}
                  </div>
                </div>
              )
            }) : (
              <div className='exercises-empty'>
                <div className='empty-icon'>👥</div>
                <h3>暂无好友动态</h3>
                <p>邀请好友一起开始健身吧</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return mins + ' 分钟前'
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return hrs + ' 小时前'
  const days = Math.floor(hrs / 24)
  return days + ' 天前'
}

export default DashboardPage