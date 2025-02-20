'use client'

import { useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Fade from '@mui/material/Fade'
import Modal from '@mui/material/Modal'
import Divider from '@mui/material/Divider'
import { motion } from 'framer-motion'
import GeminiAnalysis from '@/views/plant-detection/GeminiAnalysis'

const Input = styled('input')({
  display: 'none'
})

const StyledDropZone = styled(Box)(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(8),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: isDragActive ? theme.palette.action.hover : theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main
  }
}))

const GeminiPage = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [error, setError] = useState(null)

  const handleImageUpload = event => {
    const file = event.target.files[0]
    processFile(file)
  }

  const handleDrop = event => {
    event.preventDefault()
    setIsDragActive(false)
    
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      processFile(file)
    } else {
      setError('Please upload an image file')
    }
  }

  const processFile = file => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = e => {
      setSelectedImage({
        preview: e.target.result,
        content: e.target.result.split(',')[1],
        name: file.name
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              p: 6,
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: theme => theme.shadows[2],
              position: 'relative',
              overflow: 'hidden',
              mb: 6,
              '&::before': {
                content: '""',
                position: 'absolute',
                right: 0,
                top: 0,
                width: '30%',
                height: '100%',
                background: theme => 
                  `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                opacity: 0.1,
                clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
              }
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              <i className="tabler-brain me-2" />
              AI Plant Analysis
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Upload a plant image to get detailed AI-powered insights about its health and characteristics
            </Typography>
          </Box>
        </motion.div>
      </Grid>

      <Grid item xs={12} md={selectedImage ? 4 : 12}>
        <Card>
          <CardContent>
            <Box
              component="div"
              onDragOver={e => {
                e.preventDefault()
                setIsDragActive(true)
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleDrop}
            >
              <StyledDropZone isDragActive={isDragActive}>
                <input
                  accept="image/*"
                  id="gemini-upload"
                  type="file"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="gemini-upload">
                  <Box sx={{ mb: 3 }}>
                    <i 
                      className={isDragActive ? "tabler-upload text-primary" : "tabler-upload"} 
                      style={{ fontSize: '48px' }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Drop an image here or click to upload
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supports: JPG, PNG, WEBP
                  </Typography>
                </label>
              </StyledDropZone>
            </Box>

            {selectedImage && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Selected Image
                </Typography>
                <Box
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: theme => theme.shadows[1]
                  }}
                >
                  <img
                    src={selectedImage.preview}
                    alt="Selected plant"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block'
                    }}
                  />
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={() => setSelectedImage(null)}
                  sx={{ mt: 2 }}
                >
                  Remove Image
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {selectedImage && (
        <Grid item xs={12} md={8}>
          <GeminiAnalysis
            imageData={{
              name: selectedImage.name,
              content: selectedImage.content
            }}
          />
        </Grid>
      )}

      {/* Error Modal */}
      <Modal
        open={!!error}
        onClose={() => setError(null)}
        closeAfterTransition
      >
        <Fade in={!!error}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
              <i className="tabler-alert-circle me-2" />
              Error
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => setError(null)}
            >
              Close
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Grid>
  )
}

export default GeminiPage 