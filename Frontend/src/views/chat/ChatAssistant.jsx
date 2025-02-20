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
import { styled } from '@mui/material/styles'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'

const MarkdownContent = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
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

const WelcomeCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: 0,
    width: '30%',
    height: '100%',
    background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
    opacity: 0.1,
    clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
  }
}))

const QuickSuggestions = [
  {
    text: "How to identify plant diseases?",
    icon: "tabler-virus-search"
  },
  {
    text: "Best indoor plants for beginners?",
    icon: "tabler-plant-2"
  },
  {
    text: "Tips for plant propagation",
    icon: "tabler-plant"
  },
  {
    text: "Common watering mistakes",
    icon: "tabler-droplet"
  },
  {
    text: "Natural pest control methods",
    icon: "tabler-bug"
  }
]

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
        <i className={isBot ? 'tabler-plant-2' : 'tabler-user'} style={{ fontSize: '1.2rem' }} />
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

const ChatAssistant = () => {
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
      const response = await fetch('http://localhost:8000/api/expert-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
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
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <WelcomeCard>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <i className="tabler-plant-2" style={{ fontSize: '1.5em', color: theme.palette.primary.main }} />
            Plant Expert Assistant
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Chat with our AI plant expert about any plant-related questions. Get scientific insights, care tips, and expert advice.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {QuickSuggestions.map((suggestion, index) => (
              <Tooltip 
                key={index}
                title="Click to use this suggestion"
                TransitionComponent={Zoom}
                arrow
              >
                <Chip
                  icon={<i className={suggestion.icon} />}
                  label={suggestion.text}
                  onClick={() => setInput(suggestion.text)}
                  sx={{
                    backgroundColor: 'primary.soft',
                    '&:hover': { 
                      backgroundColor: 'primary.main', 
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' }
                    }
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </CardContent>
      </WelcomeCard>

      <Card>
        <CardContent>
          <Box
            sx={{
              height: 500,
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
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
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
              placeholder="Ask any plant-related question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              disabled={loading}
              multiline
              maxRows={4}
              size="small"
              InputProps={{
                sx: {
                  backgroundColor: 'background.paper'
                }
              }}
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
    </Box>
  )
}

export default ChatAssistant 