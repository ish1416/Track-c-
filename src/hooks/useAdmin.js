import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

const BASE = ''

export function useAdmin() {
  const { token } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [escalations, setEscalations] = useState([])
  const [systemicRisks, setSystemicRisks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const fetchComplaints = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BASE}/admin/complaints`, { headers })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Failed to fetch complaints')
      setComplaints(data.complaints ?? data ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  const fetchComplaintDetail = useCallback(async (complaintId) => {
    try {
      const res = await fetch(`${BASE}/admin/complaints/${complaintId}`, { headers })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Failed to fetch complaint')
      return data
    } catch (e) {
      setError(e.message)
      return null
    }
  }, [token])

  const updateComplaintStatus = useCallback(async (complaintId, status) => {
    try {
      const res = await fetch(`${BASE}/admin/complaints/${complaintId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Failed to update status')
      return data
    } catch (e) {
      setError(e.message)
      return null
    }
  }, [token])

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BASE}/analytics/dashboard`, { headers })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Failed to fetch analytics')
      setAnalytics(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  const fetchEscalations = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BASE}/complaints/escalations`, { headers })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Failed to fetch escalations')
      setEscalations(data.escalated_complaints ?? data.escalations ?? data ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  const fetchSystemicRisks = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BASE}/complaints/systemic-risk`, { headers })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Failed to fetch systemic risks')
      setSystemicRisks(data.alerts ?? data.risks ?? data ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  const fetchTimeline = useCallback(async (referenceId) => {
    try {
      const res = await fetch(`${BASE}/complaints/timeline/${referenceId}`, { headers })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Failed to fetch timeline')
      return data
    } catch (e) {
      setError(e.message)
      return null
    }
  }, [token])

  return {
    complaints,
    analytics,
    escalations,
    systemicRisks,
    loading,
    error,
    fetchComplaints,
    fetchComplaintDetail,
    updateComplaintStatus,
    fetchAnalytics,
    fetchEscalations,
    fetchSystemicRisks,
    fetchTimeline,
  }
}
