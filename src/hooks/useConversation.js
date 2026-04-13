import { useState, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

export function useConversation() {
  const { token } = useAuth()
  const [messages, setMessages]       = useState([])
  const [isComplete, setIsComplete]   = useState(false)
  const [referenceId, setReferenceId] = useState(null)
  const [isLoading, setIsLoading]     = useState(false)
  const [error, setError]             = useState('')

  // Use ref for session_id — never stale in async closures
  const sessionIdRef = useRef(null)

  // Recording state
  const [recState, setRecState] = useState('idle')
  const [duration, setDuration] = useState(0)
  const mediaRef  = useRef(null)
  const chunksRef = useRef([])
  const timerRef  = useRef(null)

  const authHeaders = { Authorization: `Bearer ${token}` }

  const addMsg = (role, text) =>
    setMessages(prev => [...prev, { role, text, id: Date.now() + Math.random() }])

  // ── Transcribe only (preview before conversation) ──────
  async function transcribe(blob) {
    const fd = new FormData()
    fd.append('file', blob, 'recording.wav')
    const res = await fetch('/voice/transcribe', { method: 'POST', headers: authHeaders, body: fd })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail ?? 'Transcription failed')
    return data.transcription ?? data.transcript ?? data.text ?? ''
  }

  // ── Direct submit: audio → transcribe → save to DB ────
  const submitVoiceDirect = useCallback(async (blob) => {
    setIsLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', blob, 'recording.wav')
      const res = await fetch('/voice/submit', { method: 'POST', headers: authHeaders, body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Submission failed')
      // voice/submit returns complaint with reference_id directly
      const refId = data.reference_id ?? data.complaint?.reference_id ?? null
      if (refId) {
        addMsg('ai', `Complaint filed successfully! Reference ID: ${refId}`)
        setIsComplete(true)
        setReferenceId(refId)
      } else {
        // Fall back to conversation flow with the transcript
        const text = data.transcription ?? data.transcript ?? ''
        if (text) await processInput(text, false)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // ── Core: send text through conversation API ───────────
  const processInput = useCallback(async (input, isBlob = false) => {
    setIsLoading(true)
    setError('')
    try {
      let userText = input
      if (isBlob) {
        userText = await transcribe(input)
        if (!userText) throw new Error('Could not transcribe audio. Please try again.')
      }

      addMsg('user', userText)

      const sid = sessionIdRef.current

      let resp
      if (!sid) {
        // First message — start new session
        const res = await fetch('/conversation/start', {
          method: 'POST',
          headers: { ...authHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText }),
        })
        resp = await res.json()
        if (!res.ok) throw new Error(resp.detail ?? 'Failed to start conversation')
        // Store session_id in ref immediately — available to next call without re-render
        if (resp.session_id) sessionIdRef.current = resp.session_id
      } else {
        // Subsequent messages — session is server-side (user-scoped), just send message
        const res = await fetch('/conversation/message', {
          method: 'POST',
          headers: { ...authHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText }),
        })
        resp = await res.json()
        if (!res.ok) {
          if (resp.detail?.includes('Session not found') || resp.detail?.includes('session')) {
            sessionIdRef.current = null
            throw new Error('Session expired. Please send your message again to start fresh.')
          }
          throw new Error(resp.detail ?? 'Conversation error')
        }
      }

      const aiText = resp.ai_response ?? ''
      if (aiText) addMsg('ai', aiText)

      if (resp.conversation_complete) {
        setIsComplete(true)
        setReferenceId(resp.reference_id ?? null)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // ── Voice recording ────────────────────────────────────
  const startRecording = useCallback(async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => stream.getTracks().forEach(t => t.stop())
      mr.start()
      mediaRef.current = mr
      setRecState('recording')
      let secs = 0
      timerRef.current = setInterval(() => { secs++; setDuration(secs) }, 1000)
    } catch {
      setError('Microphone access denied.')
      setRecState('idle')
    }
  }, [])

  const stopAndSend = useCallback(() => {
    clearInterval(timerRef.current)
    if (mediaRef.current?.state !== 'inactive') {
      mediaRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setRecState('processing')
        await processInput(blob, true)
        setRecState('idle')
        setDuration(0)
      }
      mediaRef.current.stop()
    }
  }, [processInput])

  const sendText = useCallback((text) => {
    if (!text.trim()) return
    processInput(text, false)
  }, [processInput])

  const reset = useCallback(() => {
    setMessages([])
    sessionIdRef.current = null
    setIsComplete(false)
    setReferenceId(null)
    setError('')
    setRecState('idle')
    setDuration(0)
    clearInterval(timerRef.current)
  }, [])

  return {
    messages, isComplete, referenceId,
    isLoading, error, recState, duration,
    startRecording, stopAndSend, sendText, reset, submitVoiceDirect,
  }
}
