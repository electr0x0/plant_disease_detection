import { useState, useRef, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

const MarkdownContent = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        // Style different markdown elements
        p: ({ children }) => (
          <Typography variant="body2" sx={{ mb: 1 }}>
            {children}
          </Typography>
        ),
        h1: ({ children }) => (
          <Typography variant="h5" sx={{ mb: 2, mt: 1 }}>
            {children}
          </Typography>
        ),
        h2: ({ children }) => (
          <Typography variant="h6" sx={{ mb: 1.5, mt: 1 }}>
            {children}
          </Typography>
        ),
        h3: ({ children }) => (
          <Typography variant="subtitle1" sx={{ mb: 1, mt: 1, fontWeight: 600 }}>
            {children}
          </Typography>
        ),
        ul: ({ children }) => (
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            {children}
          </Box>
        ),
        ol: ({ children }) => (
          <Box component="ol" sx={{ pl: 2, mb: 2 }}>
            {children}
          </Box>
        ),
        li: ({ children }) => (
          <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
            {children}
          </Typography>
        ),
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              style={atomDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <Typography
              component="code"
              sx={{
                backgroundColor: 'action.hover',
                px: 0.8,
                py: 0.2,
                borderRadius: 1,
                fontSize: '0.875rem',
                fontFamily: 'monospace'
              }}
              {...props}
            >
              {children}
            </Typography>
          )
        },
        blockquote: ({ children }) => (
          <Box
            sx={{
              borderLeft: theme => `4px solid ${theme.palette.primary.main}`,
              pl: 2,
              py: 0.5,
              my: 2,
              bgcolor: 'background.default',
              borderRadius: 1
            }}
          >
            {children}
          </Box>
        )
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

const Message = ({ content, role, thinking, animate = true }) => {
  const theme = useTheme()
  const isBot = role === 'assistant'

  const messageContent = (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 2
      }}
    >
      <Avatar
        sx={{
          bgcolor: isBot ? 'primary.main' : 'secondary.main',
          width: 32,
          height: 32
        }}
      >
        <i className={isBot ? 'tabler-robot' : 'tabler-user'} style={{ fontSize: '1.2rem' }} />
      </Avatar>
      <Box sx={{ width: '100%' }}>
        {thinking && (
          <Box
            sx={{
              p: 2,
              mb: 1,
              borderRadius: 2,
              backgroundColor: 'background.paper',
              border: '1px dashed',
              borderColor: 'primary.main',
              position: 'relative',
              '&::before': {
                content: '"Thinking Process"',
                position: 'absolute',
                top: -10,
                left: 10,
                px: 1,
                backgroundColor: 'background.paper',
                color: 'primary.main',
                fontSize: '0.75rem',
                fontWeight: 500
              }
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontStyle: 'italic',
                whiteSpace: 'pre-wrap'
              }}
            >
              {thinking}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: isBot ? 'primary.soft' : 'background.paper',
            border: theme => `1px solid ${theme.palette.divider}`,
            position: 'relative'
          }}
        >
          {isBot ? (
            <MarkdownContent content={content} />
          ) : (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {content}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )

  return animate ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {messageContent}
    </motion.div>
  ) : (
    messageContent
  )
}

const PlantChat = ({ plantContext }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const theme = useTheme()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          plant_context: plantContext
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to get response')
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        thinking: data.thinking
      }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <i className="tabler-messages" />
            Plant Care Assistant
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chat with AI about your plant analysis results
          </Typography>
        </Box>

        <Box
          sx={{
            height: 400,
            overflowY: 'auto',
            mb: 3,
            p: 2,
            backgroundColor: 'background.default',
            borderRadius: 1
          }}
        >
          <AnimatePresence>
            {messages.map((message, index) => (
              <Message key={index} {...message} />
            ))}
          </AnimatePresence>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, gap: 0.5 }}>
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={dot}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: [0, -5, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: dot * 0.2,
                    ease: "easeInOut"
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Ask about your plant..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            disabled={loading}
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            sx={{
              bgcolor: 'primary.soft',
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'white'
              }
            }}
          >
            <i className="tabler-send" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  )
}

export default PlantChat 