import { FileText, Tag, AlignLeft, Globe, MessageSquare, Download, CheckCircle2, Clock, Building2 } from 'lucide-react'

const LANG_MAP = {
  hi: 'Hindi (हिंदी)', en: 'English', bn: 'Bengali (বাঙালি)',
  ta: 'Tamil (தமிழ்)', te: 'Telugu (తెలుగు)', mr: 'Marathi (मराठी)',
  gu: 'Gujarati (ગુજરાતી)', kn: 'Kannada (ಕನ್ನಡ)', ml: 'Malayalam (മലയാളം)',
  pa: 'Punjabi (ਪੰਜਾਬੀ)', or: 'Odia (ଓଡ଼ିଆ)', as: 'Assamese (অসমীয়া)',
  ur: 'Urdu (اردو)',
}

const CATEGORY_COLORS = {
  Payments:       'bg-blue-100 text-blue-800 border-blue-300',
  Loans:          'bg-orange-100 text-orange-800 border-orange-300',
  Fraud:          'bg-red-100 text-red-800 border-red-300',
  Account:        'bg-purple-100 text-purple-800 border-purple-300',
  KYC:            'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Interest Rate':'bg-green-100 text-green-800 border-green-300',
}

function Field({ icon: Icon, label, value, mono, large }) {
  return (
    <div className="bg-[#f5f6ff] border border-[#c5cae9] rounded-lg p-3">
      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1">
        <Icon className="w-3 h-3" /> {label}
      </p>
      <p className={`text-gray-800 leading-relaxed ${mono ? 'font-mono text-xs' : large ? 'font-bold text-base text-[#1a237e]' : 'text-sm'}`}>
        {value || '—'}
      </p>
    </div>
  )
}

export default function ComplaintResult({ data }) {
  if (!data) return null

  const { transcript, language, ai_complaint } = data
  const langLabel = LANG_MAP[language] ?? language?.toUpperCase() ?? '—'
  const catColor  = CATEGORY_COLORS[ai_complaint?.category] ?? 'bg-gray-100 text-gray-700 border-gray-300'
  const refNo     = `GG-${Date.now().toString(36).toUpperCase()}`

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `complaint-${Date.now()}.json`
    a.click()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden card-lift fade-in">

      {/* Header */}
      <div className="bg-[#1b5e20] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <div>
            <p className="text-white font-bold text-sm tracking-wide">Complaint Successfully Processed</p>
            <p className="text-green-200 text-[10px] mt-0.5">AI analysis complete — review details below</p>
          </div>
        </div>
        <span className="flex items-center gap-1 bg-yellow-400/20 border border-yellow-400/40 text-yellow-200 text-[10px] font-semibold px-2.5 py-1 rounded-full">
          <Clock className="w-2.5 h-2.5" /> ID Pending
        </span>
      </div>

      {/* Reference strip */}
      <div className="bg-[#e8f5e9] border-b border-[#a5d6a7] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] text-[#2e7d32]">
          <Building2 className="w-3.5 h-3.5" />
          <span className="font-bold">Temp. Reference:</span>
          <span className="font-mono font-black tracking-wider">{refNo}</span>
        </div>
        <span className="text-[10px] text-gray-500">RBI IOS 2021 · Track C</span>
      </div>

      <div className="p-5 space-y-4">

        {/* Category + Language pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full border ${catColor}`}>
            <Tag className="w-3 h-3" /> {ai_complaint?.category ?? 'Uncategorised'}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full bg-[#e8eaf6] border border-[#c5cae9] text-[#1a237e]">
            <Globe className="w-3 h-3" /> {langLabel}
          </span>
        </div>

        {/* Complaint Title */}
        <Field icon={FileText} label="Complaint Title" value={ai_complaint?.title} large />

        {/* Complaint Description */}
        <Field icon={AlignLeft} label="Complaint Description" value={ai_complaint?.description} />

        {/* Transcript */}
        <div className="bg-[#0d1117] rounded-lg p-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> Voice Transcript
          </p>
          <p className="text-green-400 font-mono text-xs leading-relaxed">{transcript || '—'}</p>
        </div>

        {/* Pending DB notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 flex items-start gap-2">
          <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-bold text-amber-700">Complaint ID Generation — Coming Soon</p>
            <p className="text-[10px] text-amber-600 mt-0.5">
              The <code className="bg-amber-100 px-1 rounded">POST /complaints/create</code> endpoint is pending backend deployment.
              Your complaint has been processed but not yet stored in the database.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1 border-t border-gray-100">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs bg-white border border-[#1a237e] text-[#1a237e] hover:bg-[#e8eaf6] px-3 py-2 rounded-lg transition-colors font-semibold"
          >
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>
          <span className="flex items-center gap-1.5 text-[10px] text-gray-400 ml-auto">
            <CheckCircle2 className="w-3 h-3 text-green-500" /> Processed under RBI IOS 2021
          </span>
        </div>
      </div>
    </div>
  )
}
