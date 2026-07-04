import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'

const API_BASE = '/api'

export function useCheckin() {
  const { user } = useAuth()
  const [checkins, setCheckins] = useState([])
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  // Fetch user checkins
  const fetchCheckins = useCallback(async () => {
    if (!user) return
    try {
      const res = await fetch(`${API_BASE}/checkins?userId=${user.id}`)
      const data = await res.json()
      setCheckins(data.checkins || [])
    } catch (err) {
      console.error('Failed to fetch checkins:', err)
    }
  }, [user])

  // Fetch feed
  const fetchFeed = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/feed`)
      const data = await res.json()
      const feedWithUser = (data.feed || []).map(item => ({
        ...item,
        userInfo: null // will be resolved by displayName from user list
      }))
      setFeed(feedWithUser)
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

  const addCheckin = useCallback(async (exerciseName, exerciseCount, calories, duration) => {
    if (!user) return

    try {
      await fetch(`${API_BASE}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, exerciseCount, calories, duration })
      })

      // Refetch data
      await Promise.all([fetchCheckins(), fetchFeed()])
    } catch (err) {
      console.error('Failed to add checkin:', err)
    }
  }, [user, fetchCheckins, fetchFeed])

  const todayCheckin = useMemo(() =>
    checkins.find(c => c.date === todayStr) || null
  , [checkins, todayStr])

  const userCheckins = useMemo(() =>
    checkins.sort((a, b) => new Date(b.date) - new Date(a.date))
  , [checkins])

  const getMonthStats = useCallback(async (userId, year, month) => {
    try {
      const res = await fetch(`${API_BASE}/stats?userId=${userId}&range=month`)
      return await res.json()
    } catch {
      return { exercises: 0, calories: 0, duration: 0 }
    }
  }, [])

  const getWeekStats = useCallback(async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/stats?userId=${userId}&range=week`)
      return await res.json()
    } catch {
      return { exercises: 0, calories: 0, duration: 0 }
    }
  }, [])

  const getAllMonthRankings = useCallback(async (metric) => {
    try {
      const res = await fetch(`${API_BASE}/rankings?metric=${metric}`)
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
    userCheckins,
    addCheckin,
    getMonthStats,
    getWeekStats,
    getAllMonthRankings,
    getFeed
  }
}
