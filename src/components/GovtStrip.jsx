import { useState, useEffect } from 'react'
import { Clock, Lock, ExternalLink, Phone } from 'lucide-react'

export default function GovtStrip() {
  const [time, setTime]         = useState(new Date())
  const [fontSize, setFontSize] = useState('normal')

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.fontSize = fontSize === 'xl' ? '19px' : fontSize === 'large' ? '17px' : '15px'
  }, [fontSize])

  const timeStr = time.toLocaleTimeString('en-IN', { hour12: false })
  const dateStr = time.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <>
      {/* Accessibility bar */}
      <div className="bg-[#f5f5f5] border-b border-gray-200 text-[10px] text-gray-500 px-4 py-1 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-600">Screen Reader Access</span>
            <span>|</span>
            <span>Text Size:</span>
            {[['A-', 'normal'], ['A', 'large'], ['A+', 'xl']].map(([lbl, val]) => (
              <button key={val} onClick={() => setFontSize(val)}
                className={`font-bold px-1.5 py-0.5 rounded transition-colors ${fontSize === val ? 'bg-[#1a237e] text-white' : 'hover:bg-gray-200'}`}
                style={{ fontSize: val === 'normal' ? 10 : val === 'large' ? 12 : 14 }}>
                {lbl}
              </button>
            ))}
            <span>|</span>
            <span className="flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> Secure Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://sachet.rbi.org.in" target="_blank" rel="noreferrer"
              className="hover:text-[#1a237e] hover:underline flex items-center gap-0.5">
              RBI Sachet <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span>|</span>
            <a href="https://cms.rbi.org.in" target="_blank" rel="noreferrer"
              className="hover:text-[#1a237e] hover:underline flex items-center gap-0.5">
              CMS RBI <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span>|</span>
            <span className="flex items-center gap-1 text-red-600 font-semibold">
              <Phone className="w-2.5 h-2.5" /> Helpline: 14440
            </span>
          </div>
        </div>
      </div>

      {/* Tricolor */}
      <div className="tricolor-bar" />

      {/* Gov strip */}
      <div className="bg-[#060e35] text-white text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-wide">भारत सरकार &nbsp;|&nbsp; Government of India</span>
            <span className="hidden md:inline text-blue-300 border-l border-blue-700 pl-3">
              Ministry of Finance &nbsp;·&nbsp; Reserve Bank of India &nbsp;·&nbsp; I4C &nbsp;·&nbsp; MeitY
            </span>
          </div>
          <div className="flex items-center gap-2 text-blue-300 font-mono">
            <Clock className="w-3 h-3" />
            <span>{timeStr} IST &nbsp;|&nbsp; {dateStr}</span>
          </div>
        </div>
      </div>
    </>
  )
}
