import { useRef } from 'react'
import { Mic, Upload, RotateCcw, Play, Square, CheckCircle2, Send } from 'lucide-react'

function fmt(secs) {
  return `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`
}

export default function VoiceRecorder({ recState, audioUrl, duration, onStart, onStop, onUploadFile, onSubmit, audioBlob, onReset }) {
  const fileRef      = useRef(null)
  const isRecording  = recState === 'recording'
  const isProcessing = recState === 'processing'
  const isDone       = recState === 'done'
  const isIdle       = recState === 'idle'

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="card-header-gradient px-4 py-3 flex items-center gap-2">
        <Mic className="w-4 h-4 text-white opacity-80" />
        <span className="text-sm font-bold text-white uppercase tracking-wide">Voice Recorder</span>
        {isRecording && (
          <span className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-red-300">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" /> LIVE
          </span>
        )}
      </div>

      <div className="p-6 space-y-5">
        {/* Mic button */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-red-400 opacity-50 pulse-ring" />
                <div className="absolute inset-0 rounded-full border-2 border-red-300 opacity-25 pulse-ring" style={{ animationDelay: '0.6s' }} />
              </>
            )}
            <button
              onClick={isRecording ? onStop : onStart}
              disabled={isProcessing || isDone}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 scale-110'
                  : isProcessing || isDone
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-[#1a237e] hover:bg-[#283593] hover:scale-105 shadow-[0_8px_24px_rgba(26,35,126,0.35)]'
              }`}
            >
              {isRecording
                ? <Square className="w-9 h-9 text-white" />
                : <Mic className="w-9 h-9 text-white" />
              }
            </button>
          </div>

          {/* Status pill */}
          <div className="min-h-[32px] flex items-center justify-center">
            {isRecording && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-sm font-bold text-red-600">Recording {fmt(duration)}</span>
              </div>
            )}
            {isProcessing && (
              <div className="flex items-center gap-2 bg-[#e8eaf6] border border-[#c5cae9] rounded-full px-4 py-1.5">
                <div className="w-4 h-4 border-2 border-[#1a237e] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-semibold text-[#1a237e]">Processing…</span>
              </div>
            )}
            {isIdle && !audioBlob && (
              <p className="text-sm text-gray-400">Tap the mic to start recording</p>
            )}
            {isIdle && audioBlob && (
              <p className="text-sm text-green-700 font-semibold">Ready — click Submit below</p>
            )}
            {isDone && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-semibold">Processed successfully</span>
              </div>
            )}
          </div>
        </div>

        {/* Audio playback */}
        {audioUrl && (
          <div className="bg-[#f5f6ff] border border-[#e8eaf6] rounded-xl p-3">
            <p className="section-label flex items-center gap-1 mb-2">
              <Play className="w-3 h-3" /> Recorded Audio
            </p>
            <audio controls src={audioUrl} className="w-full h-8" />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          {audioBlob && isIdle && (
            <button onClick={() => onSubmit(audioBlob)} className="btn-primary flex-1 justify-center py-2.5">
              <Send className="w-4 h-4" /> Submit Complaint
            </button>
          )}
          {!isProcessing && !isDone && (
            <>
              <button onClick={() => fileRef.current?.click()} className="btn-outline py-2.5">
                <Upload className="w-3.5 h-3.5" /> Upload Audio
              </button>
              <input ref={fileRef} type="file" accept=".wav,.mp3,.m4a,.webm" className="hidden"
                onChange={e => e.target.files[0] && onUploadFile(e.target.files[0])} />
            </>
          )}
          {(isDone || audioBlob) && (
            <button onClick={onReset}
              className="flex items-center gap-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2.5 rounded-lg transition-colors font-semibold">
              <RotateCcw className="w-3.5 h-3.5" /> New
            </button>
          )}
        </div>

        <p className="text-[10px] text-gray-400 text-center">
          .wav · .mp3 · .m4a · .webm &nbsp;|&nbsp; Max 10 MB
        </p>
      </div>
    </div>
  )
}
