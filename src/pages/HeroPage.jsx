import { useState, useEffect } from 'react'
import { initAllAnimations } from '../utils/animations'
import { Link } from 'react-router-dom'
import BorderGlow from '../components/BorderGlow'
import { useAuth } from '../contexts/AuthContext'
import { useCheckin } from '../hooks/useCheckin'
import exercisesData from '../data/exercises.json'
import './HeroPage.css'
const BODY_PARTS = [
  { key: 'chest', label: '\u80f8\u90e8', icon: '\U0001f4aa', count: 0 },
  { key: 'back', label: '\u80cc\u90e8', icon: '\U0001f3cb\ufe0f', count: 0 },
  { key: 'shoulders', label: '\u80a9\u90e8', icon: '\U0001f9be', count: 0 },
  { key: 'upper arms', label: '\u624b\u81c2', icon: '\U0001f4aa', count: 0 },
  { key: 'upper legs', label: '\u5927\u817f', icon: '\U0001f9b5', count: 0 },
  { key: 'lower legs', label: '\u5c0f\u817f', icon: '\U0001f9b6', count: 0 },
  { key: 'waist', label: '\u8170\u8179', icon: '\U0001f9d8', count: 0 },
  { key: 'cardio', label: '\u6709\u6c27', icon: '\U0001f3c3', count: 0 },
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
                <span className='title-word'>\u5065\u8eab</span>
                <span className='title-word accent'>\u6253\u5361</span>
              </h1>
              <div className='hero-stats-inline'>
                <div className='stat-block'>
                  <span className='stat-number'>{exercisesData.length.toLocaleString()}</span>
                  <span className='stat-label'>\u4e13\u4e1a\u52a8\u4f5c</span>
                </div>
                <div className='stat-block'>
                  <span className='stat-number'>{BODY_PARTS.length}</span>
                  <span className='stat-label'>\u8bad\u7ec3\u90e8\u4f4d</span>
                </div>
                <div className='stat-block'>
                  <span className='stat-number'>20+</span>
                  <span className='stat-label'>\u5668\u68b0\u7c7b\u578b</span>
                </div>
              </div>
              <div className='hero-cta'>
                <Link to='/exercises' className='btn-hero-cta primary'>
                  \u6d4f\u89c8\u52a8\u4f5c\u5e93
                  <svg width='14' height='14' viewBox='0 0 16 16' fill='none'>
                    <path d='M3 8h10M9 4l4 4-4 4' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                  </svg>
                </Link>
                <Link to='/dashboard' className='btn-hero-cta ghost'>
                  \u5f00\u59cb\u6253\u5361
                </Link>
              </div>
              <p className='hero-desc'>
                \u8bb0\u5f55\u6bcf\u4e00\u6b21\u8bad\u7ec3\uff0c\u8ffd\u8e2a\u6bcf\u4e00\u5361\u8def\u91cc\u6d88\u8017\u3002<br />
                \u548c\u670b\u53cb\u4eec\u4e00\u8d77\u575a\u6301\uff0c\u8ba9\u8fd0\u52a8\u6210\u4e3a\u4e60\u60ef\u3002
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
            <span className='section-label'>\u8bad\u7ec3\u90e8\u4f4d</span>
            <h2 className='section-title'>\u6309\u90e8\u4f4d\u63a2\u7d22\u8bad\u7ec3</h2>
            <p className='section-desc'>\u4ece {BODY_PARTS.length} \u4e2a\u8bad\u7ec3\u90e8\u4f4d\u4e2d\u9009\u62e9\uff0c\u53d1\u73b0\u6700\u9002\u5408\u4f60\u7684\u52a8\u4f5c</p>
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
                  <p className='bp-count'>{bp.count} \u4e2a\u52a8\u4f5c</p>
                  <div className='bp-arrow'>\u2192</div>
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
            <p className='slogan-text'>\u5065\u8eab\u662f\u552f\u4e00\u4e00\u4ef6\uff0c\u4ed8\u51fa\u4e86\u5c31\u6709\u56de\u62a5\u7684\u4e8b\u60c5\uff0c\u4eca\u5929\u4f60\u7ec3\u4e86\u5417\uff1f</p>
          </div>
        </div>
      </section>
    </div>
  )
}
export default HeroPage