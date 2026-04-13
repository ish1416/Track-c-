import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAdmin } from '../hooks/useAdmin'
import GovtStrip from './GovtStrip'
import AshokaChakra from './AshokaChakra'
import {
  LayoutDashboard, FileText, AlertTriangle, TrendingUp,
  LogOut, X, Menu, ChevronRight, Globe, Shield,
  CheckCircle2, Clock, AlertOctagon, RefreshCw, Sparkles, ThumbsUp, Loader2
} from 'lucide-react'

const PRIORITY_BADGE = {
  high:     'bg-red-100 text-red-700 border-red-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
  medium:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  low:      'bg-green-100 text-green-700 border-green-200',
}

const STATUS_BADGE = {
  pending:      'bg-yellow-100 text-yellow-700 border-yellow-200',
  filed:        'bg-yellow-100 text-yellow-700 border-yellow-200',
  under_review: 'bg-purple-100 text-purple-700 border-purple-200',
  in_progress:  'bg-blue-100 text-blue-700 border-blue-200',
  resolved:     'bg-green-100 text-green-700 border-green-200',
  closed:       'bg-gray-100 text-gray-600 border-gray-200',
  escalated:    'bg-red-100 text-red-700 border-red-200',
}

function Badge({ val, map }) {
  const cls = map[val?.toLowerCase()] ?? 'bg-gray-100 text-gray-600 border-gray-200'
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cls} uppercase tracking-wide`}>
      {val ?? '—'}
    </span>
  )
}

function StatCard({ icon: Icon, label, value, color, bg, border }) {
  return (
    <div className={`bg-white rounded-xl border ${border} shadow-sm p-4 flex items-center gap-3`}>
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className={`text-2xl font-black ${color} leading-none`}>{value ?? '—'}</p>
        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{label}</p>
      </div>
    </div>
  )
}

const STATUS_OPTIONS = ['FILED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

function ComplaintDetailModal({ complaint, onClose, onStatusUpdate, fetchTimeline, token }) {
  const [timeline, setTimeline]       = useState(null)
  const [status, setStatus]           = useState(complaint?.status?.toUpperCase() ?? 'FILED')
  const [saving, setSaving]           = useState(false)
  const [aiRes, setAiRes]             = useState(null)
  const [aiLoading, setAiLoading]     = useState(false)
  const [approving, setApproving]     = useState(false)
  const [approved, setApproved]       = useState(false)

  useEffect(() => {
    if (complaint?.reference_id) {
      fetchTimeline(complaint.reference_id).then(setTimeline)
    }
  }, [complaint?.reference_id])

  async function handleSave() {
    setSaving(true)
    await onStatusUpdate(complaint.id, status)
    setSaving(false)
    onClose()
  }

  async function generateAiResolution() {
    setAiLoading(true)
    try {
      const res = await fetch(`/admin/complaints/${complaint.id}/ai-resolution`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Failed')
      setAiRes(data.ai_resolution ?? data)
    } catch (e) {
      setAiRes({ error: e.message })
    } finally {
      setAiLoading(false)
    }
  }

  async function approveResolution() {
    setApproving(true)
    try {
      const res = await fetch(`/admin/complaints/${complaint.id}/approve-resolution`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) { setApproved(true); setStatus('IN_PROGRESS') }
    } finally {
      setApproving(false)
    }
  }

  if (!complaint) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="govt-gradient px-5 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-white font-black text-sm">{complaint.ai_complaint?.title ?? complaint.title ?? 'Complaint Detail'}</p>
            <p className="text-blue-300 text-[10px] font-mono mt-0.5">{complaint.reference_id}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Meta row */}
          <div className="flex flex-wrap gap-2">
            <Badge val={complaint.ai_complaint?.category ?? complaint.category} map={{}} />
            <Badge val={complaint.priority} map={PRIORITY_BADGE} />
            <Badge val={complaint.status} map={STATUS_BADGE} />
            {complaint.priority_score != null && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-purple-50 text-purple-700 border-purple-200">
                Score: {complaint.priority_score}
              </span>
            )}
            {complaint.ai_confidence != null && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                AI Confidence: {Math.round(complaint.ai_confidence * 100)}%
              </span>
            )}
          </div>

          {/* Description */}
          {(complaint.ai_complaint?.description ?? complaint.description) && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {complaint.ai_complaint?.description ?? complaint.description}
              </p>
            </div>
          )}

          {/* Transcript */}
          {complaint.transcript && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Transcript</p>
              <div className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs font-mono leading-relaxed max-h-32 overflow-y-auto">
                {complaint.transcript}
              </div>
            </div>
          )}

          {/* AI Resolution */}
          <div className="border border-purple-100 rounded-xl overflow-hidden">
            <div className="bg-purple-50 px-4 py-2.5 flex items-center justify-between">
              <p className="text-[10px] font-bold text-purple-700 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Resolution
              </p>
              {!aiRes && (
                <button
                  onClick={generateAiResolution}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-white border border-purple-200 px-3 py-1 rounded-lg hover:bg-purple-50 disabled:opacity-50 transition-colors"
                >
                  {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {aiLoading ? 'Generating…' : 'Generate'}
                </button>
              )}
            </div>
            {aiRes && !aiRes.error && (
              <div className="p-4 space-y-3">
                <p className="text-sm text-gray-700 leading-relaxed">{aiRes.suggested_resolution}</p>
                <div className="flex flex-wrap gap-3 text-[10px]">
                  {aiRes.confidence != null && (
                    <span className="font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5">
                      Confidence: {Math.round(aiRes.confidence * 100)}%
                    </span>
                  )}
                  {aiRes.estimated_resolution_days != null && (
                    <span className="font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">
                      Est. {aiRes.estimated_resolution_days} days
                    </span>
                  )}
                  {aiRes.similar_cases_count != null && (
                    <span className="font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">
                      {aiRes.similar_cases_count} similar cases
                    </span>
                  )}
                </div>
                {!approved ? (
                  <button
                    onClick={approveResolution}
                    disabled={approving}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#1a237e] px-4 py-2 rounded-lg hover:bg-[#283593] disabled:opacity-50 transition-colors"
                  >
                    {approving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ThumbsUp className="w-3.5 h-3.5" />}
                    {approving ? 'Approving…' : 'Approve Resolution'}
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-green-700">
                    <CheckCircle2 className="w-4 h-4" /> Resolution Approved
                  </div>
                )}
              </div>
            )}
            {aiRes?.error && (
              <p className="px-4 py-3 text-xs text-red-600">{aiRes.error}</p>
            )}
            {!aiRes && !aiLoading && (
              <p className="px-4 py-3 text-xs text-gray-400">Click Generate to get an AI-suggested resolution for this complaint.</p>
            )}
          </div>

          {/* Timeline */}
          {timeline && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Timeline</p>
              <div className="space-y-2">
                {(timeline.stages ?? timeline.timeline ?? []).map((stage, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#1a237e] mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-700">{stage.stage ?? stage.status ?? stage.label}</p>
                      {stage.timestamp && (
                        <p className="text-[10px] text-gray-400">{new Date(stage.timestamp).toLocaleString('en-IN')}</p>
                      )}
                      {stage.note && <p className="text-[10px] text-gray-500">{stage.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status update */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Update Status</p>
            <div className="flex gap-2">
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a237e]/30"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-[#1a237e] text-white text-sm font-bold rounded-lg hover:bg-[#283593] disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const NAV = [
  { id: 'overview',   label: 'Overview',      icon: LayoutDashboard },
  { id: 'complaints', label: 'Complaints',     icon: FileText },
  { id: 'escalations',label: 'Escalations',   icon: AlertTriangle },
  { id: 'systemic',   label: 'Systemic Risk',  icon: TrendingUp },
]

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const {
    complaints, analytics, escalations, systemicRisks, loading, error,
    fetchComplaints, fetchComplaintDetail, updateComplaintStatus,
    fetchAnalytics, fetchEscalations, fetchSystemicRisks, fetchTimeline,
  } = useAdmin()

  const [tab, setTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState(null)

  // On mount
  useEffect(() => { fetchComplaints(); fetchAnalytics() }, [])

  function switchTab(id) {
    setTab(id)
    setSidebarOpen(false)
    if (id === 'escalations') fetchEscalations()
    if (id === 'systemic')    fetchSystemicRisks()
    if (id === 'complaints')  fetchComplaints()
  }

  const { token } = useAuth()

  async function openDetail(complaint) {
    const detail = await fetchComplaintDetail(complaint.id)
    setSelectedComplaint(detail ?? complaint)
  }

  async function handleStatusUpdate(id, status) {
    await updateComplaintStatus(id, status)
    fetchComplaints()
  }

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'flex' : 'hidden lg:flex'} flex-col w-64 govt-gradient text-white h-full`}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <AshokaChakra size={36} color="rgba(255,255,255,0.85)" />
          <div>
            <p className="text-[9px] font-bold text-blue-300 uppercase tracking-widest leading-none">RBI Grievance Portal</p>
            <p className="text-white font-black text-sm leading-tight mt-0.5">
              GrievanceGuard
            </p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 bg-white/8 rounded-xl px-3 py-2.5 border border-white/10">
          <div className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center text-white font-black text-sm flex-shrink-0 relative">
            {user?.name?.[0]?.toUpperCase() ?? 'A'}
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border border-white flex items-center justify-center">
              <Shield className="w-2 h-2 text-white" />
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-xs truncate">{user?.name ?? 'Admin'}</p>
            <p className="text-[#FF9933] text-[10px] font-bold uppercase tracking-wide">Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest px-3 mb-2">Admin Panel</p>
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => switchTab(id)}
            className={`nav-item w-full ${tab === id ? 'active' : ''}`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-white/10">
        <button onClick={logout}
          className="w-full flex items-center gap-2 text-xs text-red-300 hover:text-red-200 hover:bg-red-500/10 px-3 py-2.5 rounded-lg transition-colors font-semibold">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <GovtStrip />

      <div className="flex flex-1 overflow-hidden min-h-0">
        <Sidebar />

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-64 h-full">
              <Sidebar mobile />
              <button onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden bg-[#f0f2f5]">
          {/* Header */}
          <header className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <Globe className="w-3 h-3" />
                <span>Admin</span>
                <ChevronRight className="w-3 h-3" />
                <span className="font-bold text-[#1a237e]">{NAV.find(n => n.id === tab)?.label}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 rounded-full px-2.5 py-0.5">
                ADMIN ACCESS
              </span>
              <button onClick={() => { fetchComplaints(); fetchAnalytics() }}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400" title="Refresh">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-xs text-red-700">
                <AlertOctagon className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <div className="w-4 h-4 border-2 border-[#1a237e] border-t-transparent rounded-full animate-spin" />
                Loading…
              </div>
            )}

            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={FileText}     label="Total Complaints"  value={analytics?.total_complaints}    color="text-blue-600"   bg="bg-blue-50"   border="border-blue-100" />
                  <StatCard icon={AlertOctagon} label="High Priority"     value={analytics?.high_priority_count}  color="text-red-600"    bg="bg-red-50"    border="border-red-100" />
                  <StatCard icon={CheckCircle2} label="Resolved"          value={analytics?.resolved_complaints}  color="text-green-600"  bg="bg-green-50"  border="border-green-100" />
                  <StatCard icon={Clock}        label="Pending"           value={analytics?.pending_complaints}   color="text-yellow-600" bg="bg-yellow-50" border="border-yellow-100" />
                </div>

                {/* Recent complaints */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="card-header-gradient px-4 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">Recent Complaints</span>
                    <button onClick={() => switchTab('complaints')}
                      className="text-[10px] text-blue-200 hover:text-white font-semibold">View All →</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          {['Reference ID', 'Title', 'Category', 'Priority', 'Status'].map(h => (
                            <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {complaints.slice(0, 5).map(c => (
                          <tr key={c.id} onClick={() => openDetail(c)}
                            className="border-b border-gray-50 hover:bg-[#f0f2f5] cursor-pointer transition-colors">
                            <td className="px-4 py-3 font-mono text-[#1a237e] font-bold">{c.reference_id ?? '—'}</td>
                            <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate">{c.ai_complaint?.title ?? c.title ?? '—'}</td>
                            <td className="px-4 py-3 text-gray-500">{c.ai_complaint?.category ?? c.category ?? '—'}</td>
                            <td className="px-4 py-3"><Badge val={c.priority} map={PRIORITY_BADGE} /></td>
                            <td className="px-4 py-3"><Badge val={c.status} map={STATUS_BADGE} /></td>
                          </tr>
                        ))}
                        {complaints.length === 0 && !loading && (
                          <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No complaints found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* COMPLAINTS */}
            {tab === 'complaints' && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="card-header-gradient px-4 py-2.5">
                  <span className="text-xs font-bold text-white uppercase tracking-wide">All Complaints</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        {['Reference ID', 'Title', 'Category', 'Priority', 'Status', 'Date'].map(h => (
                          <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map(c => (
                        <tr key={c.id} onClick={() => openDetail(c)}
                          className="border-b border-gray-50 hover:bg-[#f0f2f5] cursor-pointer transition-colors">
                          <td className="px-4 py-3 font-mono text-[#1a237e] font-bold">{c.reference_id ?? '—'}</td>
                          <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{c.ai_complaint?.title ?? c.title ?? '—'}</td>
                          <td className="px-4 py-3 text-gray-500">{c.ai_complaint?.category ?? c.category ?? '—'}</td>
                          <td className="px-4 py-3"><Badge val={c.priority} map={PRIORITY_BADGE} /></td>
                          <td className="px-4 py-3"><Badge val={c.status} map={STATUS_BADGE} /></td>
                          <td className="px-4 py-3 text-gray-400">{c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN') : '—'}</td>
                        </tr>
                      ))}
                      {complaints.length === 0 && !loading && (
                        <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No complaints found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ESCALATIONS */}
            {tab === 'escalations' && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="card-header-gradient px-4 py-2.5">
                  <span className="text-xs font-bold text-white uppercase tracking-wide">SLA Escalations</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {escalations.map((e, i) => (
                    <div key={e.id ?? i} className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-[#f0f2f5] cursor-pointer"
                      onClick={() => openDetail(e)}>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{e.ai_complaint?.title ?? e.title ?? e.reference_id ?? '—'}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{e.reference_id}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {e.hours_overdue != null && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                            {e.hours_overdue}h overdue
                          </span>
                        )}
                        <Badge val={e.priority} map={PRIORITY_BADGE} />
                      </div>
                    </div>
                  ))}
                  {escalations.length === 0 && !loading && (
                    <p className="px-4 py-8 text-center text-gray-400 text-sm">No escalations found</p>
                  )}
                </div>
              </div>
            )}

            {/* SYSTEMIC RISK */}
            {tab === 'systemic' && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="card-header-gradient px-4 py-2.5">
                  <span className="text-xs font-bold text-white uppercase tracking-wide">Systemic Risk Patterns</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {systemicRisks.map((r, i) => (
                    <div key={r.id ?? i} className="px-4 py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800">{r.pattern ?? r.description ?? r.category ?? '—'}</p>
                        {r.category && r.pattern && (
                          <p className="text-[10px] text-gray-400 mt-0.5">{r.category}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {r.count != null && (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5">
                            {r.count} complaints
                          </span>
                        )}
                        {r.risk_level && <Badge val={r.risk_level} map={PRIORITY_BADGE} />}
                      </div>
                    </div>
                  ))}
                  {systemicRisks.length === 0 && !loading && (
                    <p className="px-4 py-8 text-center text-gray-400 text-sm">No systemic risks found</p>
                  )}
                </div>
              </div>
            )}
          </main>

          {/* Footer */}
          <div className="bg-[#060e35] text-white flex-shrink-0">
            <div className="px-4 sm:px-6 py-2 flex items-center justify-between text-[10px]">
              <span className="text-blue-400">© 2025 GrievanceGuard by YellowSense Technologies</span>
              <span className="text-blue-500">Admin Portal · IT Act, 2000</span>
            </div>
            <div className="tricolor-bar" />
          </div>
        </div>
      </div>

      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onStatusUpdate={handleStatusUpdate}
          fetchTimeline={fetchTimeline}
          token={token}
        />
      )}
    </div>
  )
}
