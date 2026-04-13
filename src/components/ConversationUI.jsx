import { useState, useEffect, useRef } from 'react'
import { Mic, Square, Send, RotateCcw, CheckCircle2, Loader2 } from 'lucide-react'

function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

function Bubble({ msg }) {
  const isUser = msg.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#1a237e] flex items-center justify-center text-white text-[10px] font-black mr-2 flex-shrink-0 mt-1">
          AI
        </div>
      )}
      <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
        isUser
          ? 'bg-[#1a237e] text-white rounded-tr-sm'
          : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
      }`}>
        {msg.text}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-[#FF9933] flex items-center justify-center text-white text-[10px] font-black ml-2 flex-shrink-0 mt-1">
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

  const isRecording   = recState === 'recording'
  const isProcessing  = recState === 'processing' || isLoading
  const inputDisabled = isProcessing || isComplete

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col h-[520px]">
      {/* Header */}
      <div className="card-header-gradient px-4 py-3 rounded-t-xl flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-bold text-white">AI Grievance Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-blue-300 hidden sm:block">हिं · தமிழ் · ગુ · বাং · मरा · ਪੰ · EN</span>
          {messages.length > 0 && (
            <button onClick={reset} className="text-white/50 hover:text-white transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#e8eaf6] flex items-center justify-center">
              <Mic className="w-8 h-8 text-[#1a237e] opacity-40" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-600">Start by speaking or typing</p>
              <p className="text-xs text-gray-400 mt-1">Describe your banking complaint in any language</p>
            </div>
          </div>
        )}

        {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}

        {isProcessing && (
          <div className="flex justify-start mb-3">
            <div className="w-7 h-7 rounded-full bg-[#1a237e] flex items-center justify-center text-white text-[10px] font-black mr-2 flex-shrink-0 mt-1">AI</div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[#1a237e] animate-spin" />
              <span className="text-xs text-gray-400">Processing…</span>
            </div>
          </div>
        )}

        {/* Completion card */}
        {isComplete && referenceId && (
          <div className="mx-2 mt-2 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-black text-green-800">Complaint Filed Successfully!</p>
            <p className="text-xs text-green-600 mt-1">Reference ID:</p>
            <p className="text-base font-black font-mono text-[#1a237e] mt-0.5">{referenceId}</p>
            <p className="text-[10px] text-gray-400 mt-2">Save this ID to track your complaint status</p>
          </div>
        )}

        {error && (
          <div className="mx-2 mt-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-100 px-3 py-3 flex-shrink-0">
        {isRecording ? (
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping flex-shrink-0" />
              <span className="text-sm font-bold text-red-600">Recording {fmt(duration)}</span>
            </div>
            <button
              onClick={stopAndSend}
              className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-md transition-colors flex-shrink-0"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={startRecording}
              disabled={inputDisabled}
              className="w-10 h-10 rounded-full bg-[#1a237e] hover:bg-[#283593] disabled:opacity-40 flex items-center justify-center text-white shadow-md transition-colors flex-shrink-0"
            >
              <Mic className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !inputDisabled && handleSend()}
              disabled={inputDisabled}
              placeholder={isComplete ? 'Complaint filed ✓' : 'Type your complaint or use mic…'}
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 disabled:bg-gray-50 disabled:text-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={!text.trim() || inputDisabled}
              className="w-10 h-10 rounded-full bg-[#FF9933] hover:bg-orange-500 disabled:opacity-40 flex items-center justify-center text-white shadow-md transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
