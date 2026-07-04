import { useState, useEffect } from 'react'
import { initAllAnimations } from '../utils/animations'
import BorderGlow from '../components/BorderGlow'
import { useAuth } from '../contexts/AuthContext'
import { useCheckin } from '../hooks/useCheckin'
import { USERS } from '../data/users'
import './DashboardPage.css'
function DashboardPage() {
  useEffect(() => { const timer = setTimeout(initAllAnimations, 100); return () => clearTimeout(timer) }, [])
  const { user } = useAuth()
  const { loading, todayCheckin, userCheckins, addCheckin, getWeekStats, getFeed } = useCheckin()
  // Step form state
  const [step, setStep] = useState(1)
  const [exerciseType, setExerciseType] = useState('')
  const [duration, setDuration] = useState('')
  const [calories, setCalories] = useState('')
  const [submitting, setSubmitting] = useState(false)
  // Data state
  const [activeTab, setActiveTab] = useState('checkin')
  const [weekStats, setWeekStats] = useState({ calories: 0, duration: 0 })
  const [feedItems, setFeedItems] = useState([])
  useEffect(() => {
    if (!user) return
    getWeekStats(user.id).then(setWeekStats)
    setFeedItems(getFeed().map(item => ({
      ...item,
      userInfo: USERS.find(u => u.id === item.userId)
    })))
  }, [user, getWeekStats, getFeed])
  const selectType = (type) => {
    setExerciseType(type)
    setStep(2)
  }
  const submitDuration = (e) => {
    e.preventDefault()
    const val = Number(duration)
    if (!val || val <= 0) return
    setStep(3)
  }
  const submitCalories = async (e) => {
    e.preventDefault()
    const cal = Number(calories)
    const dur = Number(duration)
    if (cal < 0) return
    if (dur <= 0) return
    setSubmitting(true)
    await addCheckin(exerciseType, cal, dur)
    setSubmitting(false)
    setStep(1)
    setExerciseType('')
    setDuration('')
    setCalories('')
    if (user) {
      getWeekStats(user.id).then(setWeekStats)
      setFeedItems(getFeed().map(item => ({
        ...item,
        userInfo: USERS.find(u => u.id === item.userId)
      })))
    }
  }
  const resetForm = () => {
    setStep(1)
    setExerciseType('')
    setDuration('')
    setCalories('')
  }
  if (loading) {
    return (
      <div className='dashboard-page'>
        <div className='container' style={{ textAlign: 'center', padding: '100px 0' }}>
          <div className='loader-ring' style={{ margin: '0 auto' }}></div>
          <p style={{ color: 'var(--text-muted)', marginTop: 16 }}>加载中...</p>
        </div>
      </div>
    )
  }
  const typeLabel = exerciseType === 'cardio' ? '有氧训练' : '力量训练'
  const typeIcon = exerciseType === 'cardio' ? '❤️' : '💪'
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
          <BorderGlow borderRadius={14} glowRadius={25} edgeSensitivity={20} glowIntensity={0.6} colors={['#38bdf8', '#c084fc', '#f472b6']} backgroundColor="transparent">
            <div className='today-card'>
              <div className='today-icon'>{todayCheckin?.exerciseType === 'cardio' ? '❤️' : '💪'}</div>
              <div className='today-value'>{todayCheckin?.exerciseType === 'cardio' ? '有氧' : todayCheckin?.exerciseType === 'strength' ? '力量' : '-'}</div>
              <div className='today-label'>今日训练</div>
            </div>
          </BorderGlow>
          <BorderGlow borderRadius={14} glowRadius={25} edgeSensitivity={20} glowIntensity={0.6} colors={['#38bdf8', '#c084fc', '#f472b6']} backgroundColor="transparent">
            <div className='today-card'>
              <div className='today-icon'>🔥</div>
              <div className='today-value'>{todayCheckin?.calories || 0}</div>
              <div className='today-label'>消耗热量 (kcal)</div>
            </div>
          </BorderGlow>
          <BorderGlow borderRadius={14} glowRadius={25} edgeSensitivity={20} glowIntensity={0.6} colors={['#38bdf8', '#c084fc', '#f472b6']} backgroundColor="transparent">
            <div className='today-card'>
              <div className='today-icon'>⏱️</div>
              <div className='today-value'>{todayCheckin?.duration || 0}m</div>
              <div className='today-label'>运动时长 (分钟)</div>
            </div>
          </BorderGlow>
        </div>
        <BorderGlow borderRadius={16} glowRadius={35} edgeSensitivity={25} glowIntensity={0.7} colors={['#c084fc', '#f472b6', '#38bdf8']} backgroundColor="transparent">
          <div className='checkin-form-card'>
            <h3 className='cf-title'>📋 打卡</h3>
            {step === 1 && (
              <div className='cf-step'>
                <div className='cf-step-label'>步骤 1/3 选择运动类型</div>
                <div className='type-selector'>
                  <button
                    className={'type-btn' + (exerciseType === 'cardio' ? ' selected' : '')}
                    onClick={() => selectType('cardio')}
                  >
                    <span className='type-icon'>❤️</span>
                    <span className='type-name'>有氧心率训练</span>
                    <span className='type-desc'>心率训练，持续燃脂...</span>
                  </button>
                  <button
                    className={'type-btn' + (exerciseType === 'strength' ? ' selected' : '')}
                    onClick={() => selectType('strength')}
                  >
                    <span className='type-icon'>💪</span>
                    <span className='type-name'>无氧力量训练</span>
                    <span className='type-desc'>心率训练，持续燃脂...</span>
                  </button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className='cf-step'>
                <div className='cf-step-label'>步骤 2/3 运动时长</div>
                <div className='cf-step-badge'>
                  <span className='cf-badge-icon'>{typeIcon}</span>
                  <span>{typeLabel}</span>
                </div>
                <form onSubmit={submitDuration} className='cf-number-form'>
                  <div className='cf-number-input-wrap'>
                    <input
                      type='number'
                      min='1'
                      max='600'
                      placeholder='运动时长'
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                      className='cf-number-input'
                      autoFocus
                    />
                    <span className='cf-number-unit'>分钟</span>
                  </div>
                  <div className='cf-step-actions'>
                    <button type='button' onClick={resetForm} className='cf-btn-back'>重置</button>
                    <button type='submit' className='cf-btn-next' disabled={!duration || Number(duration) <= 0}>下一步</button>
                  </div>
                </form>
              </div>
            )}
            {step === 3 && (
              <div className='cf-step'>
                <div className='cf-step-label'>步骤 3/3 热量消耗</div>
                <div className='cf-step-badge'>
                  <span className='cf-badge-icon'>{typeIcon}</span>
                  <span>{typeLabel} ✅ {duration} 分钟</span>
                </div>
                <form onSubmit={submitCalories} className='cf-number-form'>
                  <div className='cf-number-input-wrap'>
                    <input
                      type='number'
                      min='0'
                      max='5000'
                      placeholder='热量消耗'
                      value={calories}
                      onChange={e => setCalories(e.target.value)}
                      className='cf-number-input'
                      autoFocus
                    />
                    <span className='cf-number-unit'>热量 (kcal)</span>
                  </div>
                  <div className='cf-step-actions'>
                    <button type='button' onClick={() => setStep(2)} className='cf-btn-back'>上一步</button>
                    <button type='submit' className='cf-btn-submit' disabled={submitting}>
                      {submitting ? '提交中...' : '✔ 提交'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </BorderGlow>        <div className='dashboard-week-summary'>
          <h3 className='ws-title'>本周统计</h3>
          <div className='ws-bars'>
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
                  <span>运动类型</span>
                  <span>热量 (kcal)</span>
                  <span>时间 (min)</span>
                </div>
                {userCheckins.map((checkin, i) => {
                  const isToday = checkin.date === new Date().toISOString().split('T')[0]
                  const ct = checkin.exerciseType === 'cardio' ? '❤️ 有氧' : '💪 力量'
                  return (
                    <div key={i} className={'table-row' + (isToday ? ' today' : '')}>
                      <span className='cell-date'>{checkin.date}{isToday ? ' (今天)' : ''}</span>
                      <span className='cell-type'>{ct}</span>
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
            {feedItems.length > 0 ? feedItems.slice(0, 30).map(item => {
              const friend = item.userInfo
              return (
                <div key={item.id} className='feed-item'>
                  <div className='feed-avatar'>{friend?.avatar}</div>
                  <div className='feed-content'>
                    <div className='feed-header'>
                      <span className='feed-name'>{friend?.displayName}</span>
                      <span className='feed-time'>{timeAgo(item.timestamp)}</span>
                    </div>
                    <p className='feed-text'>
                      完成了 <strong>{item.exerciseName}</strong>
                      {' ? '}🔥 {item.calories} kcal ❤️ ⏱️ {item.duration} min
                    </p>
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
  if (mins < 1) return '刚刚'
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return hrs + ' 小时前'
  const days = Math.floor(hrs / 24)
  return days + ' 天前'
}
export default DashboardPage