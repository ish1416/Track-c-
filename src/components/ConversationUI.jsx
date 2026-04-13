import { useState, useEffect, useRef } from 'react'
import { Mic, Square, Send, RotateCcw, CheckCircle2, Loader2, Shield, Info } from 'lucide-react'

function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

function Bubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#1a237e] flex items-center justify-center text-white text-[10px] font-black mr-2.5 flex-shrink-0 mt-1 shadow-sm">
          AI
        </div>
      )}
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
        isUser
          ? 'bg-[#1a237e] text-white rounded-tr-sm'
          : 'bg-[#f5f6ff] border border-[#e8eaf6] text-gray-800 rounded-tl-sm'
      }`}>
        {msg.text}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center text-white text-[10px] font-black ml-2.5 flex-shrink-0 mt-1 shadow-sm">
          U
        </div>
      )}
    </div>
  )
}

export default function ConversationUI({
  messages, isComplete, referenceId, isLoading, error,
  recState, duration, startRecording, stopAndSend, sendText, reset,
}) {
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  function handleSend() {
    if (!text.trim()) return
    sendText(text.trim())
    setText('')
  }

  const isRecording  = recState === 'recording'
  const isProcessing = recState === 'processing' || isLoading
  const inputDisabled = isProcessing || isComplete

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col" style={{ height: '580px' }}>

      {/* Header */}
      <div className="card-header-gradient px-5 py-3.5 rounded-t-xl flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <div>
            <p className="text-sm font-black text-white">AI Grievance Assistant</p>
            <p className="text-[10px] text-blue-300">Powered by Bharat Trust AI · RBI IOS 2021</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-blue-300 hidden sm:block">हिं · தமிழ் · ગુ · বাং · मरा · ਪੰ · EN</span>
          {messages.length > 0 && (
            <button onClick={reset} title="New Complaint"
              className="flex items-center gap-1 text-[10px] text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-2 py-1 rounded-lg transition-colors">
              <RotateCcw className="w-3 h-3" /> New
            </button>
          )}
        </div>
      </div>

      {/* Official notice strip */}
      <div className="bg-[#e8eaf6] border-b border-[#c5cae9] px-4 py-2 flex items-center gap-2 flex-shrink-0">
        <Shield className="w-3 h-3 text-[#1a237e] flex-shrink-0" />
        <p className="text-[10px] text-[#1a237e] font-semibold">
          Authorised under RBI Integrated Ombudsman Scheme, 2021 · IT Act, 2000 · All conversations are encrypted
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#e8eaf6] flex items-center justify-center">
              <Mic className="w-10 h-10 text-[#1a237e] opacity-30" />
            </div>
            <div>
              <p className="text-base font-black text-gray-700">Start Your Complaint</p>
              <p className="text-sm text-gray-400 mt-1 max-w-xs">
                Speak or type your banking grievance in any Indian language. Our AI will guide you step by step.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {['UPI Failed', 'Fraud / Scam', 'Loan Issue', 'KYC Problem', 'Account Blocked'].map(s => (
                <button key={s} onClick={() => { sendText(s) }}
                  className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-[#e8eaf6] text-[#3949ab] border border-[#c5cae9] hover:bg-[#c5cae9] transition-colors">
                  {s}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-300">Tap a suggestion or use the mic / text box below</p>
          </div>
        )}

        {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}

        {isProcessing && (
          <div className="flex justify-start mb-4">
            <div className="w-8 h-8 rounded-full bg-[#1a237e] flex items-center justify-center text-white text-[10px] font-black mr-2.5 flex-shrink-0 mt-1">AI</div>
            <div className="bg-[#f5f6ff] border border-[#e8eaf6] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[#1a237e] animate-spin" />
              <span className="text-xs text-gray-400">AI is processing your complaint…</span>
            </div>
          </div>
        )}

        {isComplete && referenceId && (
          <div className="mx-1 mt-2 bg-green-50 border-2 border-green-200 rounded-xl p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <p className="text-base font-black text-green-800">Complaint Filed Successfully!</p>
            <p className="text-xs text-green-600 mt-1">Your Reference ID</p>
            <p className="text-xl font-black font-mono text-[#1a237e] mt-1 tracking-wider">{referenceId}</p>
            <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
              Save this ID to track your complaint status · Processed under RBI IOS 2021
            </p>
          </div>
        )}

        {error && (
          <div className="mx-1 mt-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700 flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-100 px-4 py-3.5 flex-shrink-0 bg-gray-50/50 rounded-b-xl">
        {isRecording ? (
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping flex-shrink-0" />
              <span className="text-sm font-bold text-red-600">Recording {fmt(duration)}</span>
              <span className="text-[10px] text-red-400 ml-auto">Tap stop when done</span>
            </div>
            <button onClick={stopAndSend}
              className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-md transition-colors flex-shrink-0">
              <Square className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={startRecording} disabled={inputDisabled} title="Record voice"
              className="w-11 h-11 rounded-full bg-[#1a237e] hover:bg-[#283593] disabled:opacity-40 flex items-center justify-center text-white shadow-md transition-colors flex-shrink-0">
              <Mic className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !inputDisabled && handleSend()}
              disabled={inputDisabled}
              placeholder={isComplete ? 'Complaint filed successfully ✓' : 'Type your complaint in any language…'}
              className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 disabled:bg-gray-100 disabled:text-gray-400 bg-white"
            />
            <button onClick={handleSend} disabled={!text.trim() || inputDisabled} title="Send"
              className="w-11 h-11 rounded-full bg-[#FF9933] hover:bg-orange-500 disabled:opacity-40 flex items-center justify-center text-white shadow-md transition-colors flex-shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
