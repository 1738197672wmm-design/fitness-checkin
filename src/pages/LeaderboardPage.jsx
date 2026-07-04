import { useState, useMemo, useEffect } from 'react'
import { initAllAnimations } from '../utils/animations'
import { useCheckin } from '../hooks/useCheckin'
import { USERS as USERS_IMPORT } from '../data/users'
import './LeaderboardPage.css'

function LeaderboardPage() {
  useEffect(() => { const timer = setTimeout(initAllAnimations, 100); return () => clearTimeout(timer) }, [])
  const [period, setPeriod] = useState('month')
  const [metric, setMetric] = useState('exercises')
  const { checkins, getAllMonthRankings, getWeekStats } = useCheckin()

  const rankings = useMemo(() => {
    if (period === 'month') {
      return getAllMonthRankings(metric)
    }
    const stats = {}
    USERS_IMPORT.forEach(u => {
      const ws = getWeekStats(u.id)
      stats[u.id] = ws
    })
    return USERS_IMPORT.map(u => ({
      ...u,
      exercises: stats[u.id]?.exercises || 0,
      calories: stats[u.id]?.calories || 0,
      duration: stats[u.id]?.duration || 0
    })).sort((a, b) => b[metric] - a[metric])
  }, [period, metric, checkins, getAllMonthRankings, getWeekStats])

  const medals = ['🥇', '🥈', '🥉']

  const metricLabels = {
    exercises: '打卡次数',
    calories: '消耗热量',
    duration: '运动时长'
  }

  const metricUnits = {
    exercises: ' 次',
    calories: ' kcal',
    duration: ' min'
  }

  const getValue = (user) => user[metric] || 0

  return (
    <div className='leaderboard-page'>
      <div className='container'>
        <div className='leaderboard-header'>
          <span className='section-label'>排行榜</span>
          <h2 className='section-title'>健身排行榜</h2>
          <p className='section-desc'>看看谁是你的朋友圈健身达人</p>
        </div>

        <div className='leaderboard-controls'>
          <div className='period-toggle'>
            <button className={'toggle-btn ' + (period === 'month' ? 'active' : '')} onClick={() => setPeriod('month')}>本月</button>
            <button className={'toggle-btn ' + (period === 'week' ? 'active' : '')} onClick={() => setPeriod('week')}>本周</button>
          </div>
          <div className='metric-tabs'>
            {['exercises', 'calories', 'duration'].map(m => (
              <button key={m} className={'metric-btn ' + (metric === m ? 'active' : '')} onClick={() => setMetric(m)}>
                {metricLabels[m]}
              </button>
            ))}
          </div>
        </div>

        {rankings.length > 0 && (
          <div className='leaderboard-podium'>
            {rankings.slice(0, 3).map((user, i) => (
              <div key={user.id} className={'podium-item rank-' + (i + 1)}>
                <div className='podium-medal'>{medals[i]}</div>
                <div className='podium-avatar'>{user.avatar}</div>
                <div className='podium-name'>{user.displayName}</div>
                <div className='podium-value'>{getValue(user)}{metricUnits[metric]}</div>
              </div>
            ))}
          </div>
        )}

        <div className='leaderboard-list'>
          {rankings.map((user, i) => (
            <div key={user.id} className={'list-item rank-' + (i + 1)}>
              <div className='list-rank'>
                {i < 3 ? <span className='rank-medal'>{medals[i]}</span> : <span className='rank-num'>#{i + 1}</span>}
              </div>
              <div className='list-avatar'>{user.avatar}</div>
              <div className='list-info'>
                <div className='list-name'>{user.displayName}</div>
                <div className='list-subtitle'>持续活跃中</div>
              </div>
              <div className='list-stats'>
                <div className='stat-block'><span className='stat-val'>{user.exercises || 0}</span><span className='stat-lbl'>打卡</span></div>
                <div className='stat-block'><span className='stat-val'>{user.calories || 0}</span><span className='stat-lbl'>kcal</span></div>
                <div className='stat-block'><span className='stat-val'>{user.duration || 0}</span><span className='stat-lbl'>min</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage