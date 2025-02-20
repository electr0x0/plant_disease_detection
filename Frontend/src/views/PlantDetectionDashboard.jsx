import { useState, useEffect, useRef } from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

import ImageComparison from '@/views/plant-detection/ImageComparison'
import DetectionMetrics from '@/views/plant-detection/DetectionMetrics'
import GeminiAnalysis from '@/views/plant-detection/GeminiAnalysis'

const Input = styled('input')({
  display: 'none'
})

const PlantDetectionDashboard = () => {
  const [originalImage, setOriginalImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [detections, setDetections] = useState([])
  const [metrics, setMetrics] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [captureMode, setCaptureMode] = useState('upload')
  const [videoDevices, setVideoDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [modelType, setModelType] = useState('detection')

  const [config, setConfig] = useState({
    tile_size: 640,
    overlap: 0.2,
    conf_threshold: 0.25
  })

  const handleConfigChange = (param, value) => {
    setConfig(prev => ({
      ...prev,
      [param]: value
    }))
  }

  const processImage = async (base64, fileName) => {
    setIsProcessing(true)

    try {
      const endpoint = modelType === 'detection' ? '/api/detect' : '/api/classify'

      const payload =
        modelType === 'detection'
          ? {
              file_name: fileName,
              file_content: base64,
              tile_size: config.tile_size,
              overlap: config.overlap,
              conf_threshold: config.conf_threshold
            }
          : {
              file_name: fileName,
              file_content: base64
            }

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        setProcessedImage(data.image_url)

        if (modelType === 'detection') {
          setDetections(data.detections)
        } else {
          setDetections([
            {
              class: data.class_name,
              confidence: data.confidence
            }
          ])
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImageUpload = async event => {
    const file = event.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = async e => {
      const base64 = e.target.result.split(',')[1]

      setOriginalImage(e.target.result)
      await processImage(base64, file.name)
    }

    reader.readAsDataURL(file)
  }

  // Handle device selection and stream
  useEffect(() => {
    async function setupStream() {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        setIsStreaming(false)
      }

      if (selectedDevice && captureMode === 'camera') {
        try {
          console.log('Attempting to access camera:', selectedDevice) // Debug log

          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: { exact: selectedDevice },
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            }
          })

          if (videoRef.current) {
            videoRef.current.srcObject = stream

            // Ensure video plays after setting srcObject
            videoRef.current.play().catch(e => console.error('Error playing video:', e))
          }

          streamRef.current = stream
          setIsStreaming(true)
          console.log('Camera stream started successfully') // Debug log
        } catch (error) {
          console.error('Error accessing camera:', error)
          setIsStreaming(false)
        }
      } else {
        setIsStreaming(false)
      }
    }

    setupStream()

    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [selectedDevice, captureMode])

  // Get available cameras with labels
  useEffect(() => {
    async function getDevices() {
      try {
        // First request temporary access to get device labels
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true })

        tempStream.getTracks().forEach(track => track.stop())

        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')

        console.log('Available video devices:', videoDevices) // Debug log
        setVideoDevices(videoDevices)

        // If we have devices but none selected, select the first one
        if (videoDevices.length > 0 && !selectedDevice) {
          setSelectedDevice(videoDevices[0].deviceId)
        }
      } catch (error) {
        console.error('Error getting devices:', error)
      }
    }

    getDevices()
  }, [])

  const handleCapture = async () => {
    if (captureMode === 'camera' && videoRef.current && isStreaming) {
      const canvas = document.createElement('canvas')

      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')

      ctx.drawImage(videoRef.current, 0, 0)

      const base64 = canvas.toDataURL('image/jpeg').split(',')[1]

      setOriginalImage(canvas.toDataURL('image/jpeg'))
      await processImage(base64, 'camera_capture.jpg')
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ImageComparison
          originalImage={originalImage}
          processedImage={processedImage}
          isProcessing={isProcessing}
          config={config}
          onConfigChange={handleConfigChange}
          captureMode={captureMode}
          onCaptureModeChange={setCaptureMode}
          videoDevices={videoDevices}
          selectedDevice={selectedDevice}
          onDeviceChange={setSelectedDevice}
          videoRef={videoRef}
          isStreaming={isStreaming}
          modelType={modelType}
          onModelTypeChange={setModelType}
        />
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: '500px' }}>
              <Grid item xs={12}>
                {captureMode === 'upload' ? (
                  <label htmlFor='upload-image'>
                    <Input accept='image/*' id='upload-image' type='file' onChange={handleImageUpload} />
                    <Button variant='contained' component='span' size='large' fullWidth>
                      <i className='tabler-upload me-2'></i>
                      Upload Plant Image
                    </Button>
                  </label>
                ) : (
                  <Button variant='contained' size='large' fullWidth onClick={handleCapture} disabled={!isStreaming}>
                    <i className='tabler-camera me-2'></i>
                    Capture and Detect
                  </Button>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <DetectionMetrics detections={detections} />
      </Grid>

      
    </Grid>
  )
}

export default PlantDetectionDashboard
