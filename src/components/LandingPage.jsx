import { Shield, Mic, Brain, FileCheck, Phone, ExternalLink, ChevronRight, Zap, Globe2, Lock, CheckCircle2, ArrowRight } from 'lucide-react'
import GovtStrip from './GovtStrip'
import AshokaChakra from './AshokaChakra'

const STATS = [
  { value: '13+', label: 'Indian Languages', sub: 'Supported by AI' },
  { value: '99%', label: 'Accuracy Rate',    sub: 'NLP Transcription' },
  { value: '< 5s', label: 'Processing Time', sub: 'Per Complaint' },
  { value: 'IOS 2021', label: 'RBI Compliant', sub: 'Ombudsman Scheme' },
]

const FEATURES = [
  {
    icon: Mic,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Voice-First Filing',
    desc: 'Record your complaint in your native language. No typing required — just speak naturally.',
  },
  {
    icon: Brain,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'AI-Powered NLP',
    desc: 'Advanced natural language processing structures your complaint automatically with category, title, and description.',
  },
  {
    icon: Globe2,
    color: 'bg-green-50 text-green-700 border-green-200',
    title: '13 Indian Languages',
    desc: 'Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu & English.',
  },
  {
    icon: Lock,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    title: 'Secure & Official',
    desc: 'End-to-end encrypted. Compliant with IT Act 2000 and RBI Integrated Ombudsman Scheme 2021.',
  },
  {
    icon: FileCheck,
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    title: 'Structured Output',
    desc: 'Every complaint is auto-categorised (Payments, Loans, Fraud, KYC, Account) and export-ready.',
  },
  {
    icon: Zap,
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    title: 'Instant Processing',
    desc: 'From voice to structured complaint in under 5 seconds. No manual data entry, no delays.',
  },
]

const STEPS = [
  { n: '01', title: 'Record or Upload', desc: 'Tap the mic and speak your complaint, or upload an existing audio file (.wav, .mp3, .m4a).' },
  { n: '02', title: 'AI Transcription', desc: 'Our NLP engine transcribes your speech and detects the language automatically.' },
  { n: '03', title: 'Complaint Structuring', desc: 'AI generates a formal complaint with title, description, and category classification.' },
  { n: '04', title: 'Review & Export', desc: 'Review the structured complaint, export as JSON, and submit to the RBI portal.' },
]

const PORTALS = [
  { label: 'RBI Sachet',         href: 'https://sachet.rbi.org.in' },
  { label: 'CMS RBI',            href: 'https://cms.rbi.org.in' },
  { label: 'Cyber Crime Portal', href: 'https://cybercrime.gov.in' },
  { label: 'CERT-In',            href: 'https://cert-in.org.in' },
  { label: 'MeitY',              href: 'https://meity.gov.in' },
]

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GovtStrip />

      {/* ── Top Nav ─────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AshokaChakra size={38} color="#1a237e" />
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">RBI Citizen Grievance Portal</p>
              <p className="text-[#1a237e] font-black text-base leading-tight">GrievanceGuard <span className="text-[#FF9933]">Track C</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[#fffde7] border border-[#fdd835] rounded-lg px-3 py-1.5">
              <img src="/logo11.png" alt="YellowSense" className="h-5 w-auto object-contain" />
              <span className="text-[10px] font-bold text-[#f57f17]">YellowSense Technologies</span>
            </div>
            <button
              onClick={onGetStarted}
              className="btn-primary text-sm py-2 px-5"
            >
              Launch Portal <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="hero-gradient text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/3 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-[#FF9933]/5 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-up">
              {/* Official badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <Shield className="w-3.5 h-3.5 text-[#FF9933]" />
                <span className="text-xs font-semibold text-blue-100">Authorised under RBI IOS 2021</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
                File Banking<br />
                Complaints with<br />
                <span className="text-[#FF9933]">Your Voice</span>
              </h1>
              <p className="text-blue-200 text-lg leading-relaxed mb-8 max-w-lg">
                India's first AI-powered voice grievance system for RBI citizens.
                Speak in any Indian language — we handle the rest.
              </p>

              <div className="flex flex-wrap gap-3">
                <button onClick={onGetStarted} className="btn-primary text-base py-3 px-7">
                  File a Complaint <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="https://cms.rbi.org.in" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm py-3 px-5 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> RBI CMS Portal
                </a>
              </div>

              {/* Helplines */}
              <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <Phone className="w-4 h-4 text-[#FF9933]" />
                  <span>Cyber Crime: <strong className="text-white font-mono">1930</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <Phone className="w-4 h-4 text-[#FF9933]" />
                  <span>RBI Helpline: <strong className="text-white font-mono">14440</strong></span>
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative float-anim">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-[#FF9933]/10 blur-2xl scale-125" />
                {/* Main circle */}
                <div className="relative w-72 h-72 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <div className="w-52 h-52 rounded-full bg-white/8 border border-white/15 flex items-center justify-center">
                    <div className="w-36 h-36 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <AshokaChakra size={80} color="rgba(255,255,255,0.9)" spin />
                    </div>
                  </div>
                  {/* Orbiting icons */}
                  {[
                    { icon: Mic,       top: '-top-4',   left: 'left-1/2 -translate-x-1/2', bg: 'bg-red-500' },
                    { icon: Brain,     top: 'top-1/2',  left: '-left-4 -translate-y-1/2',  bg: 'bg-purple-500' },
                    { icon: FileCheck, top: 'top-1/2',  left: '-right-4 -translate-y-1/2', bg: 'bg-green-500' },
                    { icon: Shield,    top: '-bottom-4',left: 'left-1/2 -translate-x-1/2', bg: 'bg-[#FF9933]' },
                  ].map(({ icon: Icon, top, left, bg }, i) => (
                    <div key={i} className={`absolute ${top} ${left} w-10 h-10 ${bg} rounded-full flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────── */}
      <section className="bg-[#1a237e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-[#FF9933]">{s.value}</p>
              <p className="text-sm font-bold text-white mt-0.5">{s.label}</p>
              <p className="text-[11px] text-blue-300 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section className="bg-[#f8f9ff] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="section-label mb-2">Why GrievanceGuard</p>
            <h2 className="text-3xl font-black text-[#1a237e]">Built for Every Indian Citizen</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              A modern, accessible grievance system that removes barriers between citizens and the RBI complaint process.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-xl border border-gray-100 p-6 card-lift">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1.5">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="section-label mb-2">Process</p>
            <h2 className="text-3xl font-black text-[#1a237e]">How It Works</h2>
            <p className="text-gray-500 mt-3">Four simple steps from voice to structured complaint</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-[#c5cae9] to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-[#1a237e] text-white font-black text-sm flex items-center justify-center mb-4 shadow-lg">
                    {s.n}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="govt-gradient text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AshokaChakra size={56} color="rgba(255,255,255,0.6)" />
          <h2 className="text-3xl font-black mt-6 mb-3">Ready to File Your Complaint?</h2>
          <p className="text-blue-200 mb-8 text-lg">
            Join thousands of citizens using GrievanceGuard to resolve banking grievances faster.
          </p>
          <button onClick={onGetStarted} className="btn-primary text-base py-3.5 px-10">
            Get Started — It's Free <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-blue-400 text-xs mt-4">
            Authorised under RBI Integrated Ombudsman Scheme, 2021 · IT Act, 2000
          </p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="bg-[#060e35] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AshokaChakra size={28} color="rgba(255,255,255,0.7)" />
              <div>
                <p className="font-black text-white text-sm">GrievanceGuard</p>
                <p className="text-blue-400 text-[10px]">Track C · RBI Citizen Portal</p>
              </div>
            </div>
            <p className="text-blue-300 text-xs leading-relaxed">
              AI-powered voice grievance system for RBI citizen complaint management under IOS 2021.
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-white mb-3">Related Portals</p>
            {PORTALS.map(p => (
              <a key={p.label} href={p.href} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-blue-300 hover:text-white transition-colors text-xs">
                <ExternalLink className="w-3 h-3 opacity-60" /> {p.label}
              </a>
            ))}
          </div>
          <div className="space-y-2">
            <p className="font-bold text-white mb-3">Emergency Helplines</p>
            {[['Cyber Crime', '1930'], ['RBI Sachet', '14440'], ['CERT-In', '1800-11-4949']].map(([l, n]) => (
              <div key={l} className="flex items-center gap-2 text-blue-300 text-xs">
                <Phone className="w-3 h-3 text-[#FF9933]" />
                <span>{l}: <strong className="text-white font-mono">{n}</strong></span>
              </div>
            ))}
            <div className="mt-4 rounded-lg overflow-hidden border border-[#fdd835]/20">
              <div className="bg-white flex items-center justify-center px-4 py-2">
                <img src="/logo11.png" alt="YellowSense" className="h-8 w-auto object-contain" />
              </div>
              <div className="bg-white/5 px-3 py-1.5 text-center">
                <p className="text-[#fdd835] font-bold text-xs">YellowSense Technologies</p>
                <p className="text-blue-400 text-[9px]">AI Security Research Lab</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-blue-500">
            <span>© 2025 GrievanceGuard by YellowSense Technologies. All rights reserved.</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              For official use only · Unauthorized access prohibited under IT Act, 2000
            </span>
          </div>
        </div>
        <div className="tricolor-bar" />
      </footer>
    </div>
  )
}
