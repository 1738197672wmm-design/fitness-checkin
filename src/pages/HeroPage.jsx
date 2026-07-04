import { useState, useEffect } from 'react'
import { initAllAnimations } from '../utils/animations'
import { Link } from 'react-router-dom'
import BorderGlow from '../components/BorderGlow'
import { useAuth } from '../contexts/AuthContext'
import { useCheckin } from '../hooks/useCheckin'
import exercisesData from '../data/exercises.json'
import './HeroPage.css'
const BODY_PARTS = [
  { key: 'chest', label: '胸部', icon: '💪', count: 0 },
  { key: 'back', label: '背部', icon: '🏋️', count: 0 },
  { key: 'shoulders', label: '肩部', icon: '🦾', count: 0 },
  { key: 'upper arms', label: '手臂', icon: '💪', count: 0 },
  { key: 'upper legs', label: '大腿', icon: '🦵', count: 0 },
  { key: 'lower legs', label: '小腿', icon: '🦶', count: 0 },
  { key: 'waist', label: '腰腹', icon: '🧘', count: 0 },
  { key: 'cardio', label: '有氧', icon: '🏃', count: 0 },
];
BODY_PARTS.forEach(bp => {
  bp.count = exercisesData.filter(e => e.body_part === bp.key).length
})
function HeroPage() {
  useEffect(() => { const timer = setTimeout(initAllAnimations, 100); return () => clearTimeout(timer) }, [])
  const { user } = useAuth()
  const { todayCheckin, getWeekStats } = useCheckin()
  return (
    <div className='hero-page'>
      <section className='hero-section'>
        <div className='hero-bg'>
          <video className='hero-video' autoPlay loop muted playsInline>
            <source src='/background.mp4' type='video/mp4' />
          </video>
          <div className='hero-video-overlay' />
          <div className='hero-gradient-orb orb-1' />
          <div className='hero-gradient-orb orb-2' />
          <div className='hero-grid' />
        </div>
        <div className='hero-content'>
          <div className='hero-inner'>
            <div className='hero-left'>
              <h1 className='hero-title'>
                <span className='title-word'>健身</span>
                <span className='title-word accent'>打卡</span>
              </h1>
              <div className='hero-stats-inline'>
                <div className='stat-block'>
                  <span className='stat-number'>{exercisesData.length.toLocaleString()}</span>
                  <span className='stat-label'>专业动作</span>
                </div>
                <div className='stat-block'>
                  <span className='stat-number'>{BODY_PARTS.length}</span>
                  <span className='stat-label'>训练部位</span>
                </div>
                <div className='stat-block'>
                  <span className='stat-number'>20+</span>
                  <span className='stat-label'>器械类型</span>
                </div>
              </div>
              <div className='hero-cta'>
                <Link to='/exercises' className='btn-hero-cta primary'>
                  浏览动作库
                  <svg width='14' height='14' viewBox='0 0 16 16' fill='none'>
                    <path d='M3 8h10M9 4l4 4-4 4' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                  </svg>
                </Link>
                <Link to='/dashboard' className='btn-hero-cta ghost'>
                  开始打卡
                </Link>
              </div>
              <p className='hero-desc'>
                记录每一次训练，追踪每一卡路里消耗。<br />
                和朋友们一起坚持，让运动成为习惯。
              </p>
            </div>
          </div>
        </div>
        <div className='hero-scroll-indicator'>
          <div className='scroll-line' />
        </div>
      </section>
      <section className='body-parts-section' id='body-parts'>
        <div className='container'>
          <div className='bp-header'>
            <span className='section-label'>训练部位</span>
            <h2 className='section-title'>按部位探索训练</h2>
            <p className='section-desc'>从 {BODY_PARTS.length} 个训练部位中选择，发现最适合你的动作</p>
          </div>
          <div className='bp-grid'>
            {BODY_PARTS.map((bp, i) => (
              <BorderGlow
                key={bp.key}
                borderRadius={16}
                glowRadius={30}
                edgeSensitivity={25}
                glowIntensity={0.8}
                colors={['#c084fc', '#f472b6', '#38bdf8']}
                backgroundColor="transparent"
                className="animate-in"
                style={{ animationDelay: (i * 0.08) + 's' }}
              >
                <Link
                  to={'/exercises?category=' + encodeURIComponent(bp.key)}
                  className='bp-card'
                >
                  <div className='bp-card-glow' />
                  <div className='bp-icon'>{bp.icon}</div>
                  <h3 className='bp-name'>{bp.label}</h3>
                  <p className='bp-count'>{bp.count} 个动作</p>
                  <div className='bp-arrow'>→</div>
                </Link>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>
      <section className='slogan-section'>
        <div className='container'>
          <div className='slogan-card'>
            <div className='slogan-glow' />
            <p className='slogan-text'>健身是唯一一件，付出了就有回报的事情，今天你练了吗？</p>
          </div>
        </div>
      </section>
    </div>
  )
}
export default HeroPage