import { useCallback, useState } from 'react'

import { safeGetWindow } from 'utils/window'

export const useSpeak = () => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)

  const speak = useCallback((text: string) => {
    const wndw = safeGetWindow()

    if (!wndw) {
      return
    }

    const utterance = new wndw.SpeechSynthesisUtterance(text)

    const startCallback = () => {
      setIsSpeaking(true)

      utterance.removeEventListener('start', startCallback)
    }

    utterance.addEventListener('start', startCallback)

    const endCallback = () => {
      setIsSpeaking(false)

      utterance.removeEventListener('end', endCallback)
    }

    utterance.addEventListener('end', endCallback)

    wndw.speechSynthesis.speak(utterance)
  }, [])

  return {
    speak,
    isSpeaking,
  }
}
