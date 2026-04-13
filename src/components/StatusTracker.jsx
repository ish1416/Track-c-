import { useState } from 'react'
import { Search, CheckCircle2, Clock, Loader2, AlertOctagon, Shield, FileText, Phone, ExternalLink, Info } from 'lucide-react'

const STATUS_STEPS = ['submitted', 'categorized', 'action_in_progress', 'resolved']

const STATUS_META = {
  submitted:          { label: 'Submitted',       sub: 'Complaint received',        color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   ring: 'ring-blue-200' },
  categorized:        { label: 'Under Review',    sub: 'AI has classified it',      color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', ring: 'ring-purple-200' },
  action_in_progress: { label: 'Bank Processing', sub: 'Refund / action initiated', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', ring: 'ring-orange-200' },
  resolved:           { label: 'Resolved',        sub: 'Issue resolved',            color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  ring: 'ring-green-200' },
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
    <div className="space-y-5">

      {/* Search card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="card-header-gradient px-5 py-4">
          <p className="text-sm font-black text-white">Track Your Complaint</p>
          <p className="text-[11px] text-blue-300 mt-0.5">Enter your Reference ID to get real-time status</p>
        </div>

        {/* Official notice */}
        <div className="bg-[#e8eaf6] border-b border-[#c5cae9] px-5 py-2.5 flex items-center gap-2">
          <Shield className="w-3 h-3 text-[#1a237e] flex-shrink-0" />
          <p className="text-[10px] text-[#1a237e] font-semibold">
            Public service · No login required · Authorised under RBI IOS 2021
          </p>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={refId}
                onChange={e => setRefId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCheck()}
                placeholder="e.g. GRV-2026-0009"
                className="w-full text-sm border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 font-mono bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            <button
              onClick={handleCheck}
              disabled={loading || !refId.trim()}
              className="btn-primary px-6 py-3 disabled:opacity-50 rounded-xl"
            >
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <><Search className="w-4 h-4" /> <span className="hidden sm:inline">Check Status</span></>
              }
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700">
              <AlertOctagon className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Complaint Not Found</p>
                <p className="mt-0.5 text-red-500">{error} · Please verify your Reference ID</p>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-5 pt-1">

              {/* Status banner */}
              <div className={`flex items-center gap-4 rounded-xl px-5 py-4 border-2 ${meta.bg} ${meta.border}`}>
                <div className={`w-12 h-12 rounded-full ${meta.bg} border-2 ${meta.border} flex items-center justify-center flex-shrink-0`}>
                  {result.status === 'resolved'
                    ? <CheckCircle2 className={`w-6 h-6 ${meta.color}`} />
                    : <Clock className={`w-6 h-6 ${meta.color}`} />
                  }
                </div>
                <div className="min-w-0">
                  <p className={`text-base font-black ${meta.color}`}>{meta.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{meta.sub}</p>
                  <p className="text-[10px] font-mono font-bold text-gray-400 mt-1">{result.reference_id}</p>
                </div>
              </div>

              {/* Stepper */}
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Complaint Journey</p>
                <div className="flex items-start">
                  {STATUS_STEPS.map((step, i) => {
                    const done   = i <= currentStep
                    const active = i === currentStep
                    const sm     = STATUS_META[step]
                    return (
                      <div key={step} className="flex items-start flex-1 min-w-0">
                        <div className="flex flex-col items-center w-full">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black border-2 transition-all ${
                            done
                              ? `bg-[#1a237e] border-[#1a237e] text-white ${active ? 'ring-4 ring-[#1a237e]/20' : ''}`
                              : 'bg-white border-gray-200 text-gray-300'
                          }`}>
                            {done ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">{i + 1}</span>}
                          </div>
                          <p className={`text-[9px] font-bold mt-2 text-center leading-tight px-1 ${done ? 'text-[#1a237e]' : 'text-gray-300'}`}>
                            {sm.label}
                          </p>
                          {active && (
                            <span className="text-[8px] font-bold text-[#FF9933] mt-0.5">● Current</span>
                          )}
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 mt-4 mx-1 rounded transition-colors ${i < currentStep ? 'bg-[#1a237e]' : 'bg-gray-200'}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Resolution */}
              {result.resolution && (
                <div className="bg-[#f5f6ff] border border-[#c5cae9] rounded-xl p-4">
                  <p className="text-[10px] font-bold text-[#1a237e] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" /> Resolution Note
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{result.resolution}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Meanings</p>
          {Object.entries(STATUS_META).map(([key, s]) => (
            <div key={key} className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.bg} border ${s.border}`} style={{ minWidth: 8 }} />
              <span className={`text-xs font-bold ${s.color}`}>{s.label}</span>
              <span className="text-[10px] text-gray-400">— {s.sub}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Need Help?</p>
          {[
            { label: 'RBI Sachet Helpline', number: '14440', href: 'https://sachet.rbi.org.in' },
            { label: 'Cyber Crime Helpline', number: '1930',  href: 'https://cybercrime.gov.in' },
            { label: 'CMS RBI Portal',       number: null,    href: 'https://cms.rbi.org.in' },
          ].map(h => (
            <a key={h.label} href={h.href} target="_blank" rel="noreferrer"
              className="flex items-center justify-between hover:bg-[#f5f6ff] rounded-lg px-2 py-1.5 transition-colors group">
              <div className="flex items-center gap-2">
                {h.number ? <Phone className="w-3.5 h-3.5 text-[#FF9933]" /> : <ExternalLink className="w-3.5 h-3.5 text-[#1a237e]" />}
                <span className="text-xs font-semibold text-gray-700 group-hover:text-[#1a237e]">{h.label}</span>
              </div>
              {h.number && <span className="text-sm font-black font-mono text-[#1a237e]">{h.number}</span>}
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}
