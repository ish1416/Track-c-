import { useState, useRef, useCallback } from 'react'

export function useVoice(token) {
  const [recState,   setRecState]   = useState('idle')   // idle | recording | processing | done | error
  const [transcript, setTranscript] = useState(null)     // full response object
  const [errorMsg,   setErrorMsg]   = useState('')
  const [audioBlob,  setAudioBlob]  = useState(null)
  const [audioUrl,   setAudioUrl]   = useState(null)
  const [duration,   setDuration]   = useState(0)

  const mediaRef    = useRef(null)
  const chunksRef   = useRef([])
  const timerRef    = useRef(null)

  const startRecording = useCallback(async () => {
    setTranscript(null)
    setErrorMsg('')
    setAudioBlob(null)
    setAudioUrl(null)
    setDuration(0)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(t => t.stop())
      }
      mr.start()
      mediaRef.current = mr
      setRecState('recording')
      // duration counter
      let secs = 0
      timerRef.current = setInterval(() => { secs++; setDuration(secs) }, 1000)
    } catch (e) {
      setErrorMsg('Microphone access denied. Please allow microphone permissions.')
      setRecState('error')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRef.current && mediaRef.current.state !== 'inactive') {
      mediaRef.current.stop()
    }
    clearInterval(timerRef.current)
    setRecState('idle')
  }, [])

  const uploadAudio = useCallback(async (blob, filename = 'complaint.webm') => {
    if (!blob) return
    setRecState('processing')
    setErrorMsg('')
    try {
      const form = new FormData()
      form.append('file', blob, filename)
      const res = await fetch('/voice/transcribe', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? `Server error: ${res.status}`)
      setTranscript(data)
      setRecState('done')
    } catch (e) {
      setErrorMsg(e.message)
      setRecState('error')
    }
  }, [token])

  const uploadFile = useCallback(async (file) => {
    setTranscript(null)
    setErrorMsg('')
    setAudioBlob(file)
    setAudioUrl(URL.createObjectURL(file))
    await uploadAudio(file, file.name)
  }, [uploadAudio])

  const reset = useCallback(() => {
    setRecState('idle')
    setTranscript(null)
    setErrorMsg('')
    setAudioBlob(null)
    setAudioUrl(null)
    setDuration(0)
    clearInterval(timerRef.current)
  }, [])

  return {
    recState, transcript, errorMsg, audioBlob, audioUrl, duration,
    startRecording, stopRecording, uploadAudio, uploadFile, reset,
  }
}
