import { useCallback, useMemo, useState } from 'react'

import { AxiosResponse } from 'axios'
import {
  ChatCompletionRequestMessage,
  Configuration,
  CreateChatCompletionResponse,
  OpenAIApi,
} from 'openai'

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export type Messages = Array<ChatCompletionRequestMessage>

type CallParams = {
  result: { content: string; isFinal: boolean }
  onSuccess?: (params: AxiosResponse<CreateChatCompletionResponse, any>) => void
  onError?: (error: unknown) => void
  onFinally?: () => void
}

export const useChat = () => {
  const [currentContent, setCurrentContent] = useState<string | null>(null)

  const [history, setCurrentHistory] = useState<Messages | null>(null)

  const memoHistory = useMemo(() => history || [], [history])

  const clear = useCallback(() => {
    setCurrentHistory(null)
  }, [setCurrentHistory])

  const prompt = useCallback(
    async ({ result, onSuccess, onError, onFinally }: CallParams) => {
      setCurrentContent(result.content)

      if (!result.isFinal) {
        return
      }

      try {
        const response = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'Você é um assistente virtual. O seu nome é Sarah. Todas as suas respostas devem ser curtas, de no máximo 110 caracteres e você não pode responder mais de uma resposta. Sempre que o usuário quiser terminar a conversa ou der tchau, você deve terminar a resposta com CHAT_END',
            },
            ...memoHistory,
            {
              role: 'user',
              content: result.content,
            },
          ],
        })

        const responseChoices = response.data?.choices?.map(choice => ({
          content: choice.message?.content || '',
          role: choice.message?.role || 'user',
        }))

        setCurrentHistory(prev => {
          if (prev) {
            return [
              ...prev,
              {
                role: 'user',
                content: result.content,
              },
              ...responseChoices,
            ]
          }

          return [
            {
              role: 'user',
              content: result.content,
            },
            ...responseChoices,
          ]
        })

        onSuccess?.(response)
      } catch (error) {
        onError?.(error)
      } finally {
        onFinally?.()
        setCurrentContent(null)
      }
    },
    [memoHistory, setCurrentHistory]
  )

  return {
    prompt,
    history: memoHistory,
    clear,
    currentContent,
  }
}
