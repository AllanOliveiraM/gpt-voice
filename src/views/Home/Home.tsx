import { useCallback, useEffect, useState } from 'react'

import { Box, Button, Flex, Text } from '@nexpy/design-system'
import { AnimatePresence, motion } from 'framer-motion'
import { useChat } from 'hooks/useChat'
import { useSpeak } from 'hooks/useSpeak'
import { useSpeechRecognition } from 'hooks/useSpeechRecognition'
import debounce from 'lodash/debounce'
import slugify from 'slugify'

import { haveHelloSarahInString, haveSarahEndInString } from 'utils/chacks'

const Home = () => {
  const [isActive, setIsActive] = useState<boolean | null>(null)
  const [lastBotResponse, setLastBotResponse] = useState<string | null>(null)

  const { prompt, clear, history, currentContent } = useChat()

  const { speak, isSpeaking } = useSpeak()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resolveVoiceResult = useCallback(
    debounce((result: { content: string; isFinal: boolean }) => {
      const cases = [
        slugify(lastBotResponse || '', {
          lower: true,
          trim: true,
          replacement: '_',
          strict: true,
        }),
        slugify('prontinho', {
          lower: true,
          trim: true,
          replacement: '_',
          strict: true,
        }),
        slugify('Câmbio desligo!', {
          lower: true,
          trim: true,
          replacement: '_',
          strict: true,
        }),
      ]

      if (
        cases.some(currentCase =>
          currentCase.includes(
            slugify(result.content || '', {
              lower: true,
              trim: true,
              replacement: '_',
              strict: true,
            })
          )
        )
      ) {
        return
      }

      const isHello = haveHelloSarahInString(result.content)

      if (isHello) {
        setIsActive(true)
      }

      if (isHello || isActive) {
        prompt({
          result,
          onSuccess: response => {
            const textToSpeak = response.data.choices[0].message?.content || null
            const clearedTextToSpeak = textToSpeak?.replaceAll('CHAT_END', '') || null

            if (textToSpeak && clearedTextToSpeak) {
              setLastBotResponse(clearedTextToSpeak)
              speak(clearedTextToSpeak)

              if (haveSarahEndInString(textToSpeak)) {
                setIsActive(false)
              }
            }
          },
        })
      }
    }, 400),
    [prompt, speak, isActive]
  )

  const resolveVoiceResultBySpeakStatus = useCallback(
    (result: { content: string; isFinal: boolean }) => {
      if (!isSpeaking) {
        resolveVoiceResult(result)
      }
    },
    [isSpeaking, resolveVoiceResult]
  )

  const {
    start,
    isActive: speechRecognitionIsActive,
    stop,
  } = useSpeechRecognition({
    onResult: resolveVoiceResultBySpeakStatus,
    onEnd: () => {
      speak('Câmbio desligo!')
    },
    onStart: () => {
      speak('Prontinho!')
    },
  })

  useEffect(() => {
    if (isActive === false) {
      setIsActive(null)
    }
  }, [isActive])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (currentContent && !isSpeaking) {
      timer = setTimeout(() => {
        resolveVoiceResultBySpeakStatus({
          content: currentContent,
          isFinal: true,
        })
      }, 4000)
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [currentContent, isSpeaking, resolveVoiceResultBySpeakStatus])

  return (
    <Box bg='balticSea' variant='centerScreen' flexDirection='column' gap='4.2rem'>
      <Flex
        w='70rem'
        maxWidth='90vw'
        bg='platinum'
        p='1.2rem'
        borderRadius='12px'
        h='40rem'
        overflowY='auto'
        flexDirection='column-reverse'
      >
        <Flex flexDirection='column' gap='1.2rem'>
          <AnimatePresence>
            {history.map(message => (
              <motion.div
                key={message.content}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
              >
                <Box>
                  <Text
                    {...(message.role === 'user'
                      ? {
                          color: 'picton',
                        }
                      : {
                          color: 'lavenderIndigo',
                        })}
                  >
                    {message.role === 'user' ? 'Você' : 'Sarah'}
                  </Text>
                  {message.content.replaceAll('CHAT_END', '')}
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>

          <Text color='silverChalice'>
            {currentContent ? `${currentContent.replaceAll('CHAT_END', '')}...` : ' '}
          </Text>
        </Flex>
      </Flex>

      <AnimatePresence mode='wait'>
        {isSpeaking ? (
          <motion.div
            animate={{
              opacity: 1,
              y: 0,
            }}
            initial={{
              opacity: 0,
            }}
            exit={{
              opacity: 0,
            }}
            key='wave'
          >
            <div className='sound-wave'>
              <span />
              <span />
              <span />
            </div>
          </motion.div>
        ) : (
          <motion.div
            animate={{
              opacity: 1,
              y: 0,
            }}
            initial={{
              opacity: 0,
            }}
            exit={{
              opacity: 0,
            }}
            key='wave-out'
            style={{
              height: '70px',
            }}
          />
        )}
      </AnimatePresence>

      <Flex justifyContent='center' alignItems='center' gap='1.2rem'>
        {speechRecognitionIsActive ? (
          <Button
            onClick={() => {
              setIsActive(false)
              stop()
            }}
            textTransform='none'
          >
            Parar
          </Button>
        ) : (
          <Button
            onClick={() => {
              setIsActive(true)
              start()
            }}
            textTransform='none'
          >
            Começar!
          </Button>
        )}

        <Button
          onClick={() => {
            clear()
          }}
          textTransform='none'
        >
          Limpar
        </Button>
      </Flex>

      <style jsx global>
        {`
          .sound-wave {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 70px;
          }

          .sound-wave span {
            display: inline-block;
            width: 5px;
            height: 15px;
            margin: 0 5px;
            background-color: #fff;
            animation: soundWave 1s ease-in-out infinite;
          }

          .sound-wave span:nth-child(2) {
            animation-delay: 0.1s;
          }

          .sound-wave span:nth-child(3) {
            animation-delay: 0.2s;
          }

          @keyframes soundWave {
            0% {
              height: 15px;
            }
            50% {
              height: 30px;
            }
            100% {
              height: 15px;
            }
          }
        `}
      </style>
    </Box>
  )
}

export default Home
