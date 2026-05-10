import { useState, useRef, useEffect } from 'react'
import API from '../api/axios'

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold
        ${isUser
          ? 'bg-zinc-700 border border-zinc-600 text-zinc-300'
          : 'bg-linear-to-br from-violet-600 to-violet-400 text-white'
        }`}>
        {isUser ? 'You' : 'AI'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
        ${isUser
          ? 'bg-violet-500/15 border border-violet-500/20 text-zinc-200 rounded-tr-sm'
          : 'bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-tl-sm'
        }`}>
        {msg.content}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-600 to-violet-400 flex items-center justify-center shrink-0 text-xs font-bold text-white">
        AI
      </div>
      <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
          <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
          <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
        </div>
      </div>
    </div>
  )
}

const suggestions = [
  'How do I study more effectively?',
  'What is the Pomodoro technique?',
  'How to memorize concepts faster?',
  'Tips for exam preparation?',
  'How to avoid distractions while studying?',
  'What is active recall?',
]

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hi! I'm your AI study assistant 👋 Ask me anything about study techniques, time management, or your subjects. I'm here to help!",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (question) => {
    const q = question || input.trim()
    if (!q) return

    const updatedMessages = [...messages, { role: 'user', content: q }]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
        const res = await API.post('/ai/assistant', {
        question: q,
        history: updatedMessages, // send full history
        })
        setMessages((prev) => [...prev, { role: 'ai', content: res.data.answer }])
    } catch {
        setMessages((prev) => [
            ...prev,
            { role: 'ai', content: 'Sorry, something went wrong. Please try again.' },
        ])
    } finally {
        setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: 'ai',
        content: "Hi! I'm your AI study assistant 👋 Ask me anything about study techniques, time management, or your subjects. I'm here to help!",
      },
    ])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Assistant</h1>
          <p className="text-zinc-500 text-sm mt-1">Ask anything about your studies</p>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 text-sm font-medium transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
          </svg>
          Clear chat
        </button>
      </div>

      {/* Suggestions — show only at start */}
      {messages.length === 1 && (
        <div className="mb-5 shrink-0">
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">
            Suggested questions
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-left px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-violet-500/40 hover:bg-violet-500/5 text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-all duration-150"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 mb-4">
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex items-end gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about studying..."
          rows={1}
          className="flex-1 bg-transparent text-white text-sm placeholder:text-zinc-600 focus:outline-none resize-none py-1.5 px-2 max-h-32"
          style={{ overflow: 'auto' }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 flex items-center justify-center shrink-0 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Hint */}
      <p className="text-center text-zinc-700 text-xs mt-2 shrink-0">
        Press Enter to send · Shift+Enter for new line
      </p>

    </div>
  )
}