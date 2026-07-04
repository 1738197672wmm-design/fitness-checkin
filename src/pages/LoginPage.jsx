import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import './LoginPage.css'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600))
    
    const success = login(username, password)
    if (success) {
      navigate('/dashboard')
    } else {
      setError('用户名或密码错误')
    }
    setLoading(false)
  }

  // Quick fill helper
  const quickFill = (u, p) => {
    setUsername(u)
    setPassword(p)
    setError('')
  }

  return (
    <div className="login-page">
      <div className="login-bg-grid" />
      
      <div className="login-container animate-in">
        <div className="login-card">
          <div className="login-header">
            <span className="login-icon">⚡</span>
            <h1 className="login-title">健身打卡</h1>
            <p className="login-subtitle">输入账号登录，开始你的健身之旅</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="输入用户名"
                autoComplete="username"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="输入密码"
                autoComplete="current-password"
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? '登录中...' : '登 录'}
            </button>
          </form>

          <div className="login-hint">
            <p>预设账号（仅供演示）：</p>
            <div className="quick-fill">
              <button type="button" onClick={() => quickFill('admin', 'admin123')}>admin / admin123</button>
              <button type="button" onClick={() => quickFill('alex', 'alex123')}>alex / alex123</button>
              <button type="button" onClick={() => quickFill('bella', 'bella123')}>bella / bella123</button>
              <button type="button" onClick={() => quickFill('chen', 'chen123')}>chen / chen123</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
