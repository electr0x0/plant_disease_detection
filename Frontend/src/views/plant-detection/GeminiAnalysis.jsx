import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { motion } from 'framer-motion'
import { useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import PlantChat from './PlantChat'

const AnalysisCard = ({ icon, title, content, color, delay = 0 }) => {
  const theme = useTheme()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          height: '100%',
          borderRadius: 2,
          backgroundColor: 'background.paper',
          border: theme => `1px solid ${theme.palette.divider}`,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme => theme.shadows[3]
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${color}15`,
              color: color,
              mr: 2
            }}
          >
            <i className={icon} style={{ fontSize: '1.5rem' }} />
          </Box>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        {Array.isArray(content) ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {content.map((item, index) => (
              <Chip
                key={index}
                label={item}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: `${color}50`,
                  backgroundColor: `${color}08`,
                  '& .MuiChip-label': { color: 'text.primary' }
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
            {content}
          </Typography>
        )}
      </Paper>
    </motion.div>
  )
}

const GeminiAnalysis = ({ imageData }) => {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const theme = useTheme()

  const analyzeImage = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/api/analyze-plant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file_name: imageData.name,
          file_content: imageData.content
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to analyze image')
      }

      setAnalysis(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Trigger analysis when component mounts
  useEffect(() => {
    if (imageData) {
      analyzeImage()
    }
  }, [imageData])

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
              py: 8
            }}
          >
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 4, color: 'text.secondary' }}>
              Analyzing your plant with AI...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This may take a few moments
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (!analysis?.is_plant) {
    return (
      <Card>
        <CardContent>
          <Alert
            severity="warning"
            sx={{
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Plant Detected
            </Typography>
            <Typography variant="body2">
              Please upload a clear image of a plant for analysis.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <i className="tabler-plant me-2" />
              Analysis Results
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI-powered insights about your plant
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            onClick={() => setChatOpen(true)}
            startIcon={<i className="tabler-messages" />}
            sx={{
              borderRadius: '20px',
              px: 3,
              backgroundColor: theme => theme.palette.primary.main + '15',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white'
              }
            }}
          >
            Chat with AI
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AnalysisCard
              icon="tabler-leaf"
              title="Plant Type"
              content={analysis.plant_details.plant_type}
              color={theme.palette.primary.main}
              delay={0.1}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <AnalysisCard
              icon="tabler-heart"
              title="Health Status"
              content={analysis.plant_details.plant_health}
              color={theme.palette.success.main}
              delay={0.2}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <AnalysisCard
              icon="tabler-growth"
              title="Growth Stage"
              content={analysis.plant_details.growth_stage}
              color={theme.palette.info.main}
              delay={0.3}
            />
          </Grid>

          <Grid item xs={12}>
            <AnalysisCard
              icon="tabler-alert-triangle"
              title="Symptoms"
              content={analysis.plant_details.visible_symptoms}
              color={theme.palette.warning.main}
              delay={0.4}
            />
          </Grid>

          <Grid item xs={12}>
            <AnalysisCard
              icon="tabler-sun"
              title="Environmental Conditions"
              content={analysis.plant_details.environmental_conditions}
              color={theme.palette.secondary.main}
              delay={0.5}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, color: theme.palette.success.main }}>
                <i className="tabler-list-check me-2" />
                Recommended Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {analysis.plant_details.recommended_actions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <Alert
                      severity="success"
                      variant="outlined"
                      icon={<i className="tabler-check" />}
                      sx={{
                        '& .MuiAlert-message': { width: '100%' },
                        borderColor: theme.palette.success.main + '40',
                        backgroundColor: theme.palette.success.main + '08'
                      }}
                    >
                      {action}
                    </Alert>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Dialog
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent sx={{ p: 2 }}>
            <PlantChat plantContext={analysis} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default GeminiAnalysis 