import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Shield, User, Mail, Lock, AlertCircle, CheckCircle2, Eye, EyeOff, ArrowLeft, Mic, Brain, Globe2, Phone } from 'lucide-react'
import GovtStrip from './GovtStrip'
import AshokaChakra from './AshokaChakra'

const FEATURES = [
  { icon: Mic,    text: 'Voice complaint in any Indian language' },
  { icon: Brain,  text: 'AI-powered NLP structuring' },
  { icon: Globe2, text: '13 languages supported' },
  { icon: Shield, text: 'RBI IOS 2021 compliant & secure' },
]

export default function AuthPage({ onBack }) {
  const { login, register, authError, authLoading, setAuthError } = useAuth()
  const [mode, setMode]         = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [success, setSuccess]   = useState('')
  const [form, setForm]         = useState({ name: '', email: '', password: '', role: 'citizen' })

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setAuthError(''); setSuccess('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (mode === 'register') {
      const res = await register(form)
      if (res.ok) { setSuccess('Account created! Please sign in.'); setMode('login') }
    } else {
      await login({ email: form.email, password: form.password })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <GovtStrip />

      <div className="flex-1 flex">
        {/* ── Left brand panel ──────────────────────────── */}
        <div className="hidden lg:flex lg:w-[45%] hero-gradient flex-col justify-between p-10 relative overflow-hidden">
          {/* BG decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/3 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#FF9933]/5 blur-3xl" />
          </div>

          {/* Top */}
          <div className="relative">
            {onBack && (
              <button onClick={onBack}
                className="flex items-center gap-1.5 text-blue-300 hover:text-white text-xs font-semibold mb-8 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
              </button>
            )}
            <div className="flex items-center gap-3 mb-8">
              <AshokaChakra size={44} color="rgba(255,255,255,0.85)" />
              <div>
                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">RBI Citizen Grievance Portal</p>
                <p className="text-white font-black text-xl leading-tight">
                  GrievanceGuard <span className="text-[#FF9933]">Track C</span>
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-black text-white leading-tight mb-3">
              Your Voice,<br />Your Rights.
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed mb-8">
              File banking grievances in seconds using your voice.
              Powered by AI, backed by the Reserve Bank of India.
            </p>

            <div className="space-y-3">
              {FEATURES.map(f => (
                <div key={f.text} className="flex items-center gap-3 bg-white/8 border border-white/10 rounded-lg px-4 py-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-3.5 h-3.5 text-[#FF9933]" />
                  </div>
                  <span className="text-blue-100 text-sm">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="relative space-y-3">
            <div className="flex flex-wrap gap-3 text-xs text-blue-300">
              {[['Cyber Crime', '1930'], ['RBI Sachet', '14440']].map(([l, n]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-[#FF9933]" />
                  <span>{l}: <strong className="text-white font-mono">{n}</strong></span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-white/8 border border-white/10 rounded-lg px-3 py-2">
              <img src="/logo11.png" alt="YellowSense" className="h-6 w-auto object-contain bg-white rounded px-1" />
              <div>
                <p className="text-[#fdd835] font-bold text-xs">YellowSense Technologies</p>
                <p className="text-blue-400 text-[9px]">AI Security Research Lab</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right form panel ──────────────────────────── */}
        <div className="flex-1 flex flex-col bg-[#f8f9ff]">
          {/* Mobile header */}
          <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AshokaChakra size={32} color="#1a237e" />
              <div>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">RBI Grievance Portal</p>
                <p className="text-[#1a237e] font-black text-sm">GrievanceGuard Track C</p>
              </div>
            </div>
            {onBack && (
              <button onClick={onBack} className="text-xs text-[#1a237e] font-semibold flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Home
              </button>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md fade-up">

              {/* Official notice */}
              <div className="bg-[#e8eaf6] border border-[#c5cae9] rounded-xl px-4 py-3 mb-6 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-[#1a237e] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#1a237e] leading-relaxed">
                  <strong>Official Portal:</strong> Authorised under RBI Integrated Ombudsman Scheme, 2021.
                  Secured under IT Act, 2000.
                </p>
              </div>

              {/* Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                  {['login', 'register'].map(m => (
                    <button key={m}
                      onClick={() => { setMode(m); setAuthError(''); setSuccess('') }}
                      className={`flex-1 py-4 text-sm font-bold transition-colors ${
                        mode === m
                          ? 'text-[#1a237e] border-b-2 border-[#1a237e] bg-[#f5f6ff]'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {m === 'login' ? 'Sign In' : 'Register'}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="p-7 space-y-5">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">
                      {mode === 'login' ? 'Welcome back' : 'Create account'}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {mode === 'login'
                        ? 'Sign in to file and track your grievances'
                        : 'Register to access the grievance portal'}
                    </p>
                  </div>

                  {mode === 'register' && (
                    <div>
                      <label className="section-label block mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" required value={form.name}
                          onChange={e => set('name', e.target.value)}
                          placeholder="Enter your full name"
                          className="form-input" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="section-label block mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" required value={form.email}
                        onChange={e => set('email', e.target.value)}
                        placeholder="your@email.com"
                        className="form-input" />
                    </div>
                  </div>

                  <div>
                    <label className="section-label block mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type={showPass ? 'text' : 'password'} required value={form.password}
                        onChange={e => set('password', e.target.value)}
                        placeholder="Enter password"
                        className="form-input pr-10" />
                      <button type="button" onClick={() => setShowPass(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {authError && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-xs text-red-700">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" /> {authError}
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 text-xs text-green-700">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {success}
                    </div>
                  )}

                  <button type="submit" disabled={authLoading} className="btn-primary w-full justify-center py-3">
                    {authLoading
                      ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Please wait…</>
                      : mode === 'login' ? 'Sign In to Portal' : 'Create Account'
                    }
                  </button>
                </form>
              </div>

              <p className="text-center text-[10px] text-gray-400 mt-5">
                For official use only · Unauthorized access prohibited under IT Act, 2000
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="tricolor-bar" />
    </div>
  )
}
