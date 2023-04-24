import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { safeGetWindow } from 'utils/window'

type UseSpeechRecognition = {
  onResult: (result: { content: string; isFinal: boolean }) => void
  onStart?: () => void
  onEnd?: () => void
}

export const useSpeechRecognition = (params: UseSpeechRecognition) => {
  const { onResult, onStart, onEnd } = useMemo(() => params, [params])

  const [isActive, setIsActive] = useState<boolean>(false)

  const speechRecognitionRef = useRef<SpeechRecognition | null>(null)

  const start = useCallback(() => {
    if (!speechRecognitionRef.current) {
      return
    }

    speechRecognitionRef.current.start()
  }, [])

  const stop = useCallback(() => {
    if (!speechRecognitionRef.current) {
      return
    }

    speechRecognitionRef.current.stop()
  }, [])

  useEffect(() => {
    const windw = safeGetWindow() as any

    const SpeechRecognition =
      windw?.SpeechRecognition || windw?.webkitSpeechRecognition || null

    if (SpeechRecognition) {
      const instance = new SpeechRecognition() as SpeechRecognition

      instance.continuous = true
      instance.interimResults = true

      speechRecognitionRef.current = instance
    }
  }, [])

  useEffect(() => {
    if (!speechRecognitionRef.current) {
      return () => {}
    }

    const resultEvent = (event: SpeechRecognitionEvent) => {
      onResult({
        content: event.results[event.resultIndex][0].transcript,
        isFinal: event.results[event.resultIndex].isFinal,
      })
    }

    speechRecognitionRef.current.addEventListener('result', resultEvent)

    const startEvent = () => {
      setIsActive(true)

      onStart?.()
    }

    speechRecognitionRef.current.addEventListener('start', startEvent)

    const endEvent = () => {
      setIsActive(false)

      onEnd?.()
    }

    speechRecognitionRef.current.addEventListener('end', endEvent)

    return () => {
      speechRecognitionRef.current?.removeEventListener('result', resultEvent)
      speechRecognitionRef.current?.removeEventListener('start', startEvent)
      speechRecognitionRef.current?.removeEventListener('end', endEvent)
    }
  }, [onEnd, onResult, onStart, speechRecognitionRef])

  return {
    start,
    stop,
    isActive,
  }
}
