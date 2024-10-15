import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card"
import { Send, MessageCircle } from "lucide-react"

export default function AmigDateCuenta() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [input])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setIsLoading(true)
    try {
      const res = await axios.post('/api/insight', { insight: input })
      setResponse(res.data.response)
      setInput('')
    } catch (err) {
      console.error('Error en POST:', err)
      setResponse('Hubo un error al procesar tu insight. Intentá de nuevo, che.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg bg-white">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">Amig@ Date Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Contame qué te anda pasando, dale..."
              className="w-full border-2 border-blue-300 focus:border-blue-500 rounded-lg p-3 min-h-[100px] resize-none overflow-hidden"
            />
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? 'Procesando...' : 'Dale, tirame la posta'}
              <Send className="ml-2" size={18} />
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {response && (
            <div className="w-full bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-700 flex items-start">
                <MessageCircle className="mr-2 mt-1 flex-shrink-0" size={18} />
                <span className="flex-grow">{response}</span>
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}