import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useConversation } from '../hooks/useConversation'
import ConversationUI from './ConversationUI'
import StatusTracker from './StatusTracker'
import GovtStrip from './GovtStrip'
import AshokaChakra from './AshokaChakra'
import {
  Shield, LogOut, Mic, Info,
  Phone, ExternalLink, FileText, LayoutDashboard,
  ChevronRight, Globe, CheckCircle2, Clock, Menu, X, Search,
  RefreshCw, AlertOctagon
} from 'lucide-react'

const PORTAL_LINKS = [
  { label: 'RBI Sachet',  href: 'https://sachet.rbi.org.in' },
  { label: 'CMS RBI',     href: 'https://cms.rbi.org.in' },
  { label: 'Cyber Crime', href: 'https://cybercrime.gov.in' },
  { label: 'CERT-In',     href: 'https://cert-in.org.in' },
]

const STATS = [
  { icon: Mic,          label: 'Voice Complaints',  value: '—',    color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  { icon: CheckCircle2, label: 'Processed Today',   value: '—',    color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
  { icon: Clock,        label: 'Avg. Process Time', value: '< 5s', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  { icon: Globe,        label: 'Languages',         value: '7',    color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
]

const CATEGORIES = ['Payments', 'Loans', 'Fraud', 'KYC', 'Account', 'Interest Rate']

const STATUS_BADGE = {
  submitted:          'bg-blue-100 text-blue-700 border-blue-200',
  categorized:        'bg-purple-100 text-purple-700 border-purple-200',
  action_in_progress: 'bg-orange-100 text-orange-700 border-orange-200',
  resolved:           'bg-green-100 text-green-700 border-green-200',
  filed:              'bg-yellow-100 text-yellow-700 border-yellow-200',
  under_review:       'bg-purple-100 text-purple-700 border-purple-200',
  in_progress:        'bg-blue-100 text-blue-700 border-blue-200',
  closed:             'bg-gray-100 text-gray-600 border-gray-200',
}

const STATUS_LABEL = {
  submitted: 'Submitted', categorized: 'Under Review',
  action_in_progress: 'Bank Processing', resolved: 'Resolved',
  filed: 'Filed', under_review: 'Under Review',
  in_progress: 'In Progress', closed: 'Closed',
}

export default function Dashboard() {
  const { user, logout, token } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tab, setTab] = useState('complaint')

  // My Complaints state
  const [myComplaints, setMyComplaints]   = useState([])
  const [myLoading, setMyLoading]         = useState(false)
  const [myError, setMyError]             = useState('')

  const conv = useConversation()

  async function fetchMyComplaints() {
    setMyLoading(true)
    setMyError('')
    try {
      const res = await fetch('/complaints/my', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Failed to load complaints')
      setMyComplaints(Array.isArray(data) ? data : data.complaints ?? [])
    } catch (e) {
      setMyError(e.message)
    } finally {
      setMyLoading(false)
    }
  }

  function switchTab(id) {
    setTab(id)
    setSidebarOpen(false)
    if (id === 'mycomplaints') fetchMyComplaints()
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
              Grievance Guard
            </p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 bg-white/8 rounded-xl px-3 py-2.5 border border-white/10">
          <div className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-xs truncate">{user?.name ?? 'Citizen'}</p>
            <p className="text-blue-300 text-[10px] truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="section-label text-blue-400 px-3 mb-2">Navigation</p>
        <button onClick={() => switchTab('overview')}
          className={`nav-item ${tab === 'overview' ? 'active' : ''}`}>
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </button>
        <button onClick={() => switchTab('complaint')}
          className={`nav-item ${tab === 'complaint' ? 'active' : ''}`}>
          <Mic className="w-4 h-4" /> Voice Complaint
        </button>
        <button onClick={() => switchTab('mycomplaints')}
          className={`nav-item ${tab === 'mycomplaints' ? 'active' : ''}`}>
          <FileText className="w-4 h-4" /> My Complaints
        </button>
        <button onClick={() => switchTab('status')}
          className={`nav-item ${tab === 'status' ? 'active' : ''}`}>
          <Search className="w-4 h-4" /> Track Status
        </button>

        <div className="pt-4">
          <p className="section-label text-blue-400 px-3 mb-2">Quick Links</p>
          {PORTAL_LINKS.map(p => (
            <a key={p.label} href={p.href} target="_blank" rel="noreferrer"
              className="nav-item text-[12px]">
              <ExternalLink className="w-3.5 h-3.5 opacity-60" /> {p.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Helplines */}
      <div className="px-4 py-4 border-t border-white/10 space-y-2">
        <p className="section-label text-blue-400 mb-2">Helplines</p>
        {[['Cyber Crime', '1930'], ['RBI Sachet', '14440']].map(([l, n]) => (
          <div key={l} className="flex items-center gap-2 text-[11px] text-blue-300">
            <Phone className="w-3 h-3 text-[#FF9933]" />
            <span>{l}: <strong className="text-white font-mono">{n}</strong></span>
          </div>
        ))}
      </div>

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

          {/* Top header */}
          <header className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
            <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <Globe className="w-3 h-3" />
                  <span>Home</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>GrievanceGuard</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="font-bold text-[#1a237e]">
                    {{ overview: 'Dashboard', complaint: 'Voice Complaint', mycomplaints: 'My Complaints', status: 'Track Status' }[tab]}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="live-dot text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5 hidden sm:inline">SYSTEM LIVE</span>
                <div className="hidden sm:flex items-center gap-1.5 bg-[#e8eaf6] border border-[#c5cae9] rounded-lg px-3 py-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#1a237e]" />
                  <span className="text-[11px] font-bold text-[#1a237e]">RBI IOS 2021</span>
                </div>
                <div className="hidden md:flex items-center gap-2.5 bg-[#fffde7] border-2 border-[#fdd835] rounded-xl px-3 py-2 shadow-sm">
                  <div className="bg-white rounded-lg px-1.5 py-0.5 flex items-center justify-center">
                    <img src="/logo11.png" alt="YellowSense" className="h-6 w-auto object-contain" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-[#e65100] leading-none">YellowSense</p>
                    <p className="text-[9px] font-bold text-[#f57f17] leading-none mt-0.5">Technologies Pvt. Ltd.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticker */}
            <div className="bg-[#fff8e1] border-t border-[#ffe082] overflow-hidden">
              <div className="flex items-stretch">
                <div className="flex-shrink-0 bg-[#FF9933] text-white text-[10px] font-black px-3 flex items-center uppercase tracking-widest">ALERT</div>
                <div className="overflow-hidden flex-1 py-1.5 px-2">
                  <div className="ticker-track flex gap-16 whitespace-nowrap text-[11px] text-[#5d4037] font-medium">
                    {[
                      '⚠ RBI Advisory: File complaints only through official portals',
                      '📢 GrievanceGuard Track C — AI Voice Complaint System now live',
                      '🛡 Authorised under RBI Integrated Ombudsman Scheme, 2021',
                      '📞 RBI Helpline: 14440 · Cyber Crime: 1930',
                      '✅ All complaints processed under IT Act, 2000',
                    ].flatMap((item, i) => [
                      <span key={i}>{item}</span>,
                      <span key={`d${i}`}>{item}</span>,
                    ])}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Stats bar */}
          <div className="bg-white border-b border-gray-100 flex-shrink-0">
            <div className="px-4 sm:px-6 py-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {STATS.map(s => (
                <div key={s.label} className={`rounded-xl border-2 ${s.border} p-4 flex items-center gap-3 bg-white hover:shadow-md transition-shadow`}>
                  <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0 border ${s.border}`}>
                    <s.icon className={`${s.color}`} style={{ width: 22, height: 22 }} />
                  </div>
                  <div>
                    <p className={`text-2xl font-black ${s.color} leading-none tracking-tight`}>{s.value}</p>
                    <p className="text-[11px] text-gray-500 font-semibold mt-1 leading-tight">{s.label}</p>
                    <p className="text-[9px] text-gray-300 uppercase tracking-widest mt-0.5 font-bold">GrievanceGuard</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">

            {/* ── VOICE COMPLAINT TAB ── */}
            {tab === 'complaint' && (
              <>
                <div className="mb-5">
                  <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Mic className="w-5 h-5 text-[#1a237e]" /> Voice Complaint Filing
                  </h1>
                  <p className="text-gray-400 text-sm mt-0.5">
                    Speak or type your complaint — AI will guide you through the process
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Left column */}
                  <div className="lg:col-span-1 space-y-4">
                    {/* How it works */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="card-header-gradient px-4 py-2.5">
                        <span className="text-xs font-bold text-white uppercase tracking-wide">How It Works</span>
                      </div>
                      <div className="p-4 space-y-3">
                        {[
                          ['1', 'Tap mic or type your complaint'],
                          ['2', 'AI transcribes & understands your issue'],
                          ['3', 'AI asks follow-up questions if needed'],
                          ['4', 'Complaint filed — get your Reference ID'],
                        ].map(([n, t]) => (
                          <div key={n} className="flex items-start gap-3 text-xs text-gray-600">
                            <span className="w-5 h-5 rounded-full bg-[#1a237e] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                      <p className="section-label mb-3">Complaint Categories</p>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                          <span key={cat} className="badge bg-[#e8eaf6] text-[#3949ab] border-[#c5cae9]">{cat}</span>
                        ))}
                      </div>
                    </div>

                    {/* RBI info */}
                    <div className="bg-[#e8eaf6] border border-[#c5cae9] rounded-xl p-4 space-y-2.5">
                      <p className="text-xs font-bold text-[#1a237e] flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" /> RBI Integrated Ombudsman Scheme
                      </p>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Complaints processed under RBI IOS, 2021. File directly at{' '}
                        <a href="https://cms.rbi.org.in" target="_blank" rel="noreferrer"
                          className="text-[#1a237e] font-semibold underline">cms.rbi.org.in</a>.
                      </p>
                      <div className="flex items-center gap-2 pt-1 border-t border-[#c5cae9] text-xs text-[#1a237e]">
                        <Phone className="w-3 h-3 text-[#FF9933]" />
                        <span>RBI Helpline: <strong className="font-mono">14440</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right column — conversation */}
                  <div className="lg:col-span-2">
                    <ConversationUI
                      messages={conv.messages}
                      isComplete={conv.isComplete}
                      referenceId={conv.referenceId}
                      isLoading={conv.isLoading}
                      error={conv.error}
                      recState={conv.recState}
                      duration={conv.duration}
                      startRecording={conv.startRecording}
                      stopAndSend={conv.stopAndSend}
                      sendText={conv.sendText}
                      reset={conv.reset}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── OVERVIEW TAB ── */}
            {tab === 'overview' && (
              <div className="space-y-5">

                {/* Welcome banner */}
                <div className="govt-gradient rounded-xl p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-1">Citizen Portal · RBI IOS 2021</p>
                    <h1 className="text-white font-black text-lg leading-tight">Welcome, {user?.name ?? 'Citizen'}</h1>
                    <p className="text-blue-200 text-xs mt-1">File and track your banking grievances securely</p>
                    <button onClick={() => switchTab('complaint')}
                      className="mt-3 flex items-center gap-2 bg-[#FF9933] hover:bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                      <Mic className="w-3.5 h-3.5" /> File a Complaint Now
                    </button>
                  </div>
                  <div className="hidden sm:block opacity-20">
                    <AshokaChakra size={80} color="#ffffff" />
                  </div>
                </div>

                {/* Quick action cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: Mic,      label: 'File a Voice Complaint', desc: 'Speak or type your banking complaint in any language', tab: 'complaint',    color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100',   accent: 'bg-blue-600' },
                    { icon: FileText, label: 'My Complaints',          desc: 'View status of all complaints filed under your account', tab: 'mycomplaints', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', accent: 'bg-purple-600' },
                    { icon: Search,   label: 'Track Status',           desc: 'Enter reference ID to check real-time complaint status', tab: 'status',       color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100',  accent: 'bg-green-600' },
                  ].map(c => (
                    <button key={c.tab} onClick={() => switchTab(c.tab)}
                      className={`bg-white rounded-xl border ${c.border} shadow-sm p-5 text-left hover:shadow-md transition-all hover:-translate-y-0.5 group`}>
                      <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                        <c.icon className={`w-5 h-5 ${c.color}`} />
                      </div>
                      <p className="font-black text-gray-800 text-sm">{c.label}</p>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{c.desc}</p>
                      <p className={`text-xs font-bold mt-3 ${c.color} group-hover:underline`}>Get Started →</p>
                    </button>
                  ))}
                </div>

                {/* Process steps + RBI info row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                  {/* How it works */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="card-header-gradient px-4 py-2.5">
                      <span className="text-xs font-bold text-white uppercase tracking-wide">How It Works</span>
                    </div>
                    <div className="p-4 space-y-3">
                      {[
                        { n: '01', title: 'Record or Type',      desc: 'Speak your complaint in any Indian language or type it' },
                        { n: '02', title: 'AI Understands',      desc: 'AI transcribes, detects language and understands your issue' },
                        { n: '03', title: 'Guided Conversation', desc: 'AI asks follow-up questions to collect all required details' },
                        { n: '04', title: 'Complaint Filed',     desc: 'Receive a unique Reference ID to track your complaint' },
                      ].map(s => (
                        <div key={s.n} className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-full bg-[#1a237e] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{s.n}</span>
                          <div>
                            <p className="text-xs font-bold text-gray-800">{s.title}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{s.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RBI info + helplines */}
                  <div className="space-y-4">
                    <div className="bg-[#e8eaf6] border border-[#c5cae9] rounded-xl p-4 space-y-3">
                      <p className="text-xs font-black text-[#1a237e] flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" /> RBI Integrated Ombudsman Scheme, 2021
                      </p>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        All complaints are processed under the RBI IOS 2021 framework. Authorised by the Reserve Bank of India under the IT Act, 2000.
                      </p>
                      <a href="https://cms.rbi.org.in" target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a237e] hover:underline">
                        <ExternalLink className="w-3 h-3" /> Visit CMS RBI Portal
                      </a>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Emergency Helplines</p>
                      <div className="space-y-2.5">
                        {[
                          { label: 'RBI Sachet Helpline',  number: '14440', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                          { label: 'Cyber Crime Helpline', number: '1930',  color: 'bg-red-50 border-red-200 text-red-700' },
                        ].map(h => (
                          <div key={h.label} className={`flex items-center justify-between rounded-lg px-3 py-2 border ${h.color}`}>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5" />
                              <span className="text-xs font-semibold">{h.label}</span>
                            </div>
                            <span className="font-black font-mono text-sm">{h.number}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Supported Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {['English', 'Hindi', 'Tamil', 'Gujarati', 'Bengali', 'Marathi', 'Punjabi'].map(l => (
                          <span key={l} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#e8eaf6] text-[#3949ab] border border-[#c5cae9]">{l}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Portal links */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="card-header-gradient px-4 py-2.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">Official Government Portals</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-gray-50">
                    {[
                      { label: 'RBI Sachet',         href: 'https://sachet.rbi.org.in',   desc: 'Report illegal schemes' },
                      { label: 'CMS RBI',            href: 'https://cms.rbi.org.in',       desc: 'Official complaint portal' },
                      { label: 'Cyber Crime Portal', href: 'https://cybercrime.gov.in',    desc: 'Report cyber fraud' },
                      { label: 'CERT-In',            href: 'https://cert-in.org.in',       desc: 'Cyber security incidents' },
                    ].map(p => (
                      <a key={p.label} href={p.href} target="_blank" rel="noreferrer"
                        className="flex flex-col gap-1 px-4 py-3 hover:bg-[#f5f6ff] transition-colors group">
                        <span className="text-xs font-bold text-[#1a237e] group-hover:underline flex items-center gap-1">
                          <ExternalLink className="w-3 h-3 opacity-60" /> {p.label}
                        </span>
                        <span className="text-[10px] text-gray-400">{p.desc}</span>
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ── MY COMPLAINTS TAB ── */}
            {tab === 'mycomplaints' && (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#1a237e]" /> My Complaints
                    </h1>
                    <p className="text-gray-400 text-sm mt-0.5">All complaints filed under your account</p>
                  </div>
                  <button onClick={fetchMyComplaints}
                    className="flex items-center gap-1.5 text-xs text-[#1a237e] bg-white border border-[#c5cae9] px-3 py-2 rounded-lg hover:bg-[#e8eaf6] transition-colors font-semibold">
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                </div>

                {myError && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-xs text-red-700">
                    <AlertOctagon className="w-4 h-4 flex-shrink-0" /> {myError}
                  </div>
                )}

                {myLoading && (
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <div className="w-4 h-4 border-2 border-[#1a237e] border-t-transparent rounded-full animate-spin" />
                    Loading your complaints…
                  </div>
                )}

                {!myLoading && myComplaints.length === 0 && !myError && (
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 px-8 text-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-[#e8eaf6] flex items-center justify-center">
                      <FileText className="w-8 h-8 text-[#1a237e] opacity-30" />
                    </div>
                    <p className="text-sm font-bold text-gray-600">No complaints filed yet</p>
                    <p className="text-xs text-gray-400">Use Voice Complaint to file your first complaint</p>
                    <button onClick={() => switchTab('complaint')} className="btn-primary text-xs py-2 px-4 mt-1">
                      <Mic className="w-3.5 h-3.5" /> File a Complaint
                    </button>
                  </div>
                )}

                {myComplaints.length > 0 && (
                  <div className="space-y-3">
                    {myComplaints.map((c, i) => {
                      const statusKey = c.status?.toLowerCase()
                      const badgeCls = STATUS_BADGE[statusKey] ?? 'bg-gray-100 text-gray-600 border-gray-200'
                      const statusLabel = STATUS_LABEL[statusKey] ?? c.status
                      return (
                        <div key={c.id ?? i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-800 truncate">
                                {c.title ?? c.ai_complaint?.title ?? 'Complaint'}
                              </p>
                              <p className="text-[10px] font-mono text-[#1a237e] font-bold mt-0.5">
                                {c.reference_id ?? '—'}
                              </p>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${badgeCls}`}>
                              {statusLabel}
                            </span>
                          </div>
                          {(c.description ?? c.ai_complaint?.description) && (
                            <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
                              {c.description ?? c.ai_complaint?.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50 text-[10px] text-gray-400">
                            {c.category && <span className="bg-[#e8eaf6] text-[#3949ab] px-2 py-0.5 rounded-full font-semibold">{c.category}</span>}
                            {c.created_at && <span>{new Date(c.created_at).toLocaleDateString('en-IN')}</span>}
                            {c.reference_id && (
                              <button onClick={() => { switchTab('status') }}
                                className="ml-auto text-[#1a237e] font-semibold hover:underline">
                                Track →
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            )}

            {/* ── STATUS TRACKER TAB ── */}
            {tab === 'status' && (
              <>
                <div className="mb-5">
                  <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Search className="w-5 h-5 text-[#1a237e]" /> Track Complaint Status
                  </h1>
                  <p className="text-gray-400 text-sm mt-0.5">
                    Enter your reference ID to check the current status
                  </p>
                </div>
                <div className="max-w-2xl">
                  <StatusTracker />
                </div>
              </>
            )}
          </main>

          {/* Footer */}
          <div className="bg-[#060e35] text-white flex-shrink-0">
            <div className="px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-[10px]">
              <div className="flex items-center gap-4">
                <span className="text-blue-400">© 2025 GrievanceGuard by YellowSense Technologies</span>
                <span className="hidden sm:flex items-center gap-3 text-blue-500">
                  {PORTAL_LINKS.map(p => (
                    <a key={p.label} href={p.href} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 hover:text-white transition-colors">
                      <ExternalLink className="w-2.5 h-2.5" /> {p.label}
                    </a>
                  ))}
                </span>
              </div>
              <span className="text-blue-500">For official use only · IT Act, 2000</span>
            </div>
            <div className="tricolor-bar" />
          </div>
        </div>
      </div>
    </div>
  )
}
