import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'

const API_BASE = '/api'

export function useCheckin() {
  const { user } = useAuth()
  const [checkins, setCheckins] = useState([])
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)
  const [todayCount, setTodayCount] = useState(0)

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  // Fetch user checkins
  const fetchCheckins = useCallback(async () => {
    if (!user) return
    try {
      const res = await fetch(API_BASE + '/checkins?userId=' + user.id)
      const data = await res.json()
      setCheckins(data.checkins || [])
      setTodayCount(data.todayCount || 0)
    } catch (err) {
      console.error('Failed to fetch checkins:', err)
    }
  }, [user])

  // Fetch feed
  const fetchFeed = useCallback(async () => {
    try {
      const res = await fetch(API_BASE + '/feed')
      const data = await res.json()
      setFeed(data.feed || [])
    } catch (err) {
      console.error('Failed to fetch feed:', err)
    }
  }, [])

  useEffect(() => {
    if (user) {
      Promise.all([fetchCheckins(), fetchFeed()]).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user, fetchCheckins, fetchFeed])

  const addCheckin = useCallback(async (exerciseType, calories, duration) => {
    if (!user) return false
    try {
      const res = await fetch(API_BASE + '/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, exerciseType, calories, duration })
      })
      const data = await res.json()
      if (!data.success) {
        return data.error || '´ò¿¨Ê§°Ü'
      }
      await Promise.all([fetchCheckins(), fetchFeed()])
      return true
    } catch (err) {
      console.error('Failed to add checkin:', err)
      return 'ÍøÂç´íÎó£¬ÇëÖØÊÔ'
    }
  }, [user, fetchCheckins, fetchFeed])

  // Aggregate today's checkins (sum calories/duration, pick latest exerciseType)
  const todayCheckin = useMemo(() => {
    const todayRows = checkins.filter(c => c.date === todayStr)
    if (todayRows.length === 0) return null
    return {
      calories: todayRows.reduce((s, r) => s + r.calories, 0),
      duration: todayRows.reduce((s, r) => s + r.duration, 0),
      exerciseType: todayRows[todayRows.length - 1].exerciseType,
    }
  }, [checkins, todayStr])

  const userCheckins = useMemo(() =>
    [...checkins].sort((a, b) => new Date(b.date) - new Date(a.date))
  , [checkins])

  const getMonthStats = useCallback(async (userId) => {
    try {
      const res = await fetch(API_BASE + '/stats?userId=' + userId + '&range=month')
      return await res.json()
    } catch {
      return { exercises: 0, calories: 0, duration: 0 }
    }
  }, [])

  const getWeekStats = useCallback(async (userId) => {
    try {
      const res = await fetch(API_BASE + '/stats?userId=' + userId + '&range=week')
      return await res.json()
    } catch {
      return { exercises: 0, calories: 0, duration: 0 }
    }
  }, [])

  const getAllMonthRankings = useCallback(async (metric) => {
    try {
      const res = await fetch(API_BASE + '/rankings?metric=' + metric)
      const data = await res.json()
      return data.rankings || []
    } catch {
      return []
    }
  }, [])

  const getFeed = useCallback(() => feed, [feed])

  return {
    loading,
    checkins,
    todayCheckin,
    todayCount,
    userCheckins,
    addCheckin,
    getMonthStats,
    getWeekStats,
    getAllMonthRankings,
    getFeed
  }
}
