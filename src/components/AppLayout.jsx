import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './AppLayout.css'

function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen)
    return () => document.body.classList.remove('nav-open')
  }, [menuOpen])

  return (
    <div className="app-layout">
      {menuOpen && <div className="nav-backdrop open" onClick={closeMenu} />}
      <nav className="top-nav">
        <div className="container nav-inner">
          <NavLink to="/" className="nav-logo" onClick={closeMenu}>
            <span className="logo-icon">⚡</span>
            <span className="logo-text">健身打卡</span>
          </NavLink>
          <button
            className={menuOpen ? 'hamburger open' : 'hamburger'}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="切换菜单"
          >
            <span />
            <span />
            <span />
          </button>
          <div className={menuOpen ? 'nav-links open' : 'nav-links'}>
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>首页</NavLink>
            <NavLink to="/exercises" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>动作库</NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>打卡</NavLink>
            <NavLink to="/leaderboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>排名</NavLink>
          </div>
          <div className="nav-user">
            {user ? (
              <>
                <span className="user-badge">
                  <span className="user-avatar">{user.avatar}</span>
                  <span className="user-name">{user.displayName}</span>
                </span>
                <button onClick={handleLogout} className="btn-logout">退出</button>
              </>
            ) : (
              <NavLink to="/login" className="btn-login" onClick={closeMenu}>登录</NavLink>
            )}
          </div>
        </div>
      </nav>
      <main className="main-content"><Outlet /></main>
      <footer className="app-footer">
        <div className="container footer-inner">
          <p> fitness check-in · 和朋友一起坚持运动</p>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout
