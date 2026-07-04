import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { USERS } from '../data/users'

const STORAGE_KEY = 'fitness_checkins'

function loadAllCheckins() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

function saveAllCheckins(checkins) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checkins))
}

export function useCheckin() {
  const { user } = useAuth()
  const [checkins, setCheckins] = useState([])
  const [feed, setFeed] = useState(() => {
    try {
      const data = localStorage.getItem('fitness_feed')
      return data ? JSON.parse(data) : []
    } catch { return [] }
  })

  useEffect(() => {
    setCheckins(loadAllCheckins())
  }, [])

  useEffect(() => {
    localStorage.setItem('fitness_feed', JSON.stringify(feed))
  }, [feed])

  const addCheckin = useCallback((exerciseName, exerciseCount, calories, duration) => {
    if (!user) return
    const today = new Date().toISOString().split('T')[0]
    const now = new Date().toISOString()

    setCheckins(prev => {
      const existing = prev.findIndex(c => c.userId === user.id && c.date === today)
      let updated
      if (existing >= 0) {
        updated = prev.map((c, i) => i === existing
          ? { ...c, exerciseCount: c.exerciseCount + exerciseCount, calories: c.calories + calories, duration: c.duration + duration }
          : c
        )
      } else {
        updated = [...prev, { userId: user.id, date: today, exerciseCount, calories, duration }]
      }
      saveAllCheckins(updated)
      return updated
    })

    setFeed(prev => [{
      id: 'f' + Date.now(),
      userId: user.id,
      type: 'checkin',
      exerciseName,
      calories,
      duration,
      timestamp: now
    }, ...prev].slice(0, 50))
  }, [user])

  const todayStr = new Date().toISOString().split('T')[0]
  const todayCheckin = useMemo(() =>
    checkins.find(c => c.userId === user?.id && c.date === todayStr) || null
  , [checkins, user, todayStr])

  const userCheckins = useMemo(() =>
    checkins.filter(c => c.userId === user?.id).sort((a, b) => new Date(b.date) - new Date(a.date))
  , [checkins, user])

  const getMonthStats = useCallback((userId, year, month) => {
    const prefix = year + '-' + String(month + 1).padStart(2, '0')
    const monthCheckins = checkins.filter(c => c.userId === userId && c.date.startsWith(prefix))
    return {
      exercises: monthCheckins.reduce((s, c) => s + c.exerciseCount, 0),
      calories: monthCheckins.reduce((s, c) => s + c.calories, 0),
      duration: monthCheckins.reduce((s, c) => s + c.duration, 0),
    }
  }, [checkins])

  const getWeekStats = useCallback((userId) => {
    const now = new Date()
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekCheckins = checkins.filter(c => {
      return c.userId === userId && new Date(c.date) >= weekAgo
    })
    return {
      exercises: weekCheckins.reduce((s, c) => s + c.exerciseCount, 0),
      calories: weekCheckins.reduce((s, c) => s + c.calories, 0),
      duration: weekCheckins.reduce((s, c) => s + c.duration, 0),
    }
  }, [checkins])

  const getAllMonthRankings = useCallback((metric) => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const prefix = year + '-' + String(month + 1).padStart(2, '0')
    const monthCheckins = checkins.filter(c => c.date.startsWith(prefix))
    
    const stats = {}
    monthCheckins.forEach(c => {
      if (!stats[c.userId]) stats[c.userId] = { exercises: 0, calories: 0, duration: 0 }
      stats[c.userId].exercises += c.exerciseCount
      stats[c.userId].calories += c.calories
      stats[c.userId].duration += c.duration
    })
    
    return USERS.map(u => ({
      ...u,
      exercises: stats[u.id]?.exercises || 0,
      calories: stats[u.id]?.calories || 0,
      duration: stats[u.id]?.duration || 0
    })).sort((a, b) => b[metric] - a[metric])
  }, [checkins])

  const getFeed = useCallback(() => {
    return feed.map(item => ({
      ...item,
      userInfo: USERS.find(u => u.id === item.userId)
    }))
  }, [feed])

  return {
    checkins,
    todayCheckin,
    userCheckins,
    addCheckin,
    getMonthStats,
    getWeekStats,
    getAllMonthRankings,
    getFeed
  }
}
