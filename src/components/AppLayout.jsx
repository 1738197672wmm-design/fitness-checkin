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
            <span className="logo-icon">\u26a1</span>
            <span className="logo-text">\u5065\u8eab\u6253\u5361</span>
          </NavLink>
          <button
            className={menuOpen ? 'hamburger open' : 'hamburger'}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="\u5207\u6362\u83dc\u5355"
          >
            <span />
            <span />
            <span />
          </button>
          <div className={menuOpen ? 'nav-links open' : 'nav-links'}>
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>\u9996\u9875</NavLink>
            <NavLink to="/exercises" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>\u52a8\u4f5c\u5e93</NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>\u6253\u5361</NavLink>
            <NavLink to="/leaderboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>\u6392\u540d</NavLink>
          </div>
          <div className="nav-user">
            {user ? (
              <>
                <span className="user-badge">
                  <span className="user-avatar">{user.avatar}</span>
                  <span className="user-name">{user.displayName}</span>
                </span>
                <button onClick={handleLogout} className="btn-logout">\u9000\u51fa</button>
              </>
            ) : (
              <NavLink to="/login" className="btn-login" onClick={closeMenu}>\u767b\u5f55</NavLink>
            )}
          </div>
        </div>
      </nav>
      <main className="main-content"><Outlet /></main>
      <footer className="app-footer">
        <div className="container footer-inner">
          <p> fitness check-in \u00b7 \u548c\u670b\u53cb\u4e00\u8d77\u575a\u6301\u8fd0\u52a8</p>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout
