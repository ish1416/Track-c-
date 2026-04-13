import { useState } from 'react'
import { Search, CheckCircle2, Clock, Loader2, AlertOctagon } from 'lucide-react'

const STATUS_STEPS = ['submitted', 'categorized', 'action_in_progress', 'resolved']

const STATUS_META = {
  submitted:          { label: 'Submitted',       color: 'text-blue-600',  bg: 'bg-blue-50',  border: 'border-blue-200' },
  categorized:        { label: 'Under Review',    color: 'text-purple-600',bg: 'bg-purple-50',border: 'border-purple-200' },
  action_in_progress: { label: 'Bank Processing', color: 'text-orange-600',bg: 'bg-orange-50',border: 'border-orange-200' },
  resolved:           { label: 'Resolved',        color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
}

export default function StatusTracker() {
  const [refId, setRefId]     = useState('')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleCheck() {
    if (!refId.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`/complaints/${refId.trim()}/resolution`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Complaint not found')
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const currentStep = result ? STATUS_STEPS.indexOf(result.status) : -1
  const meta = result ? (STATUS_META[result.status] ?? STATUS_META.submitted) : null

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="card-header-gradient px-4 py-2.5">
        <span className="text-xs font-bold text-white uppercase tracking-wide">Track Complaint Status</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Search */}
        <div className="flex gap-2">
          <input
            type="text"
            value={refId}
            onChange={e => setRefId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCheck()}
            placeholder="Enter Reference ID (e.g. GRV-2026-0009)"
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 font-mono"
          />
          <button
            onClick={handleCheck}
            disabled={loading || !refId.trim()}
            className="btn-primary py-2.5 px-4 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-xs text-red-700">
            <AlertOctagon className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Status badge */}
            <div className={`flex items-center gap-2 rounded-xl px-4 py-3 border ${meta.bg} ${meta.border}`}>
              {result.status === 'resolved'
                ? <CheckCircle2 className={`w-5 h-5 ${meta.color}`} />
                : <Clock className={`w-5 h-5 ${meta.color}`} />
              }
              <div>
                <p className={`text-sm font-black ${meta.color}`}>{meta.label}</p>
                <p className="text-[10px] text-gray-500 font-mono">{result.reference_id}</p>
              </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-1">
              {STATUS_STEPS.map((step, i) => {
                const done    = i <= currentStep
                const active  = i === currentStep
                const sm = STATUS_META[step]
                return (
                  <div key={step} className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-colors ${
                        done
                          ? 'bg-[#1a237e] border-[#1a237e] text-white'
                          : 'bg-white border-gray-200 text-gray-300'
                      } ${active ? 'ring-2 ring-[#1a237e]/30' : ''}`}>
                        {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <p className={`text-[9px] font-bold mt-1 text-center leading-tight ${done ? 'text-[#1a237e]' : 'text-gray-300'}`}>
                        {sm.label}
                      </p>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mb-4 rounded ${i < currentStep ? 'bg-[#1a237e]' : 'bg-gray-100'}`} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Resolution text */}
            {result.resolution && (
              <div className="bg-[#f5f6ff] border border-[#c5cae9] rounded-lg p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Resolution Note</p>
                <p className="text-sm text-gray-700 leading-relaxed">{result.resolution}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
