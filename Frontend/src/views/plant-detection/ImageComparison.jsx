// src/components/plant-detection/ImageComparison.jsx
import { useState, useCallback } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

const ImageViewer = ({ image, onClose }) => {
  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={0}
      initialPositionY={0}
      minScale={0.5}
      maxScale={4}
      centerOnInit={true}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <div className='relative w-full h-full flex justify-center items-center'>
          <div className='absolute top-4 right-4 z-10 flex gap-2'>
            <IconButton
              onClick={() => zoomIn()}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
              }}
            >
              <i className='tabler-zoom-in fs-3'></i>
            </IconButton>
            <IconButton
              onClick={() => zoomOut()}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
              }}
            >
              <i className='tabler-zoom-out fs-3'></i>
            </IconButton>
            <IconButton
              onClick={() => resetTransform()}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
              }}
            >
              <i className='tabler-focus fs-3'></i>
            </IconButton>
            <IconButton
              onClick={onClose}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
              }}
            >
              <i className='tabler-x fs-3'></i>
            </IconButton>
          </div>
          <TransformComponent
            wrapperStyle={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img
              src={image}
              alt='Zoomed plant'
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  )
}

const ConfigurationPanel = ({ config, onChange, modelType }) => {
  if (modelType !== 'detection') return null

  return (
    <Box
      sx={{
        p: 4,
        borderBottom: theme => `1px solid ${theme.palette.divider}`,
        backgroundColor: theme => theme.palette.background.default,
        borderRadius: '0 0 12px 12px'
      }}
    >
      <Typography variant='h6' sx={{ mb: 4, fontWeight: 600, color: 'primary.main' }}>
        <i className='tabler-adjustments me-2'></i>
        Detection Configuration
      </Typography>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: 1,
              backgroundColor: theme => theme.palette.background.paper,
              boxShadow: theme => `0 0 0 1px ${theme.palette.divider}`,
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: 3
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <i className='tabler-grid-dots me-2 text-primary'></i>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                Tile Size
              </Typography>
            </Box>
            <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 3 }}>
              Size of image tiles for processing (32-2048px)
            </Typography>
            <Typography sx={{ mb: 1 }}>{config.tile_size}px</Typography>
            <Slider
              value={config.tile_size}
              onChange={(_, value) => onChange('tile_size', value)}
              min={32}
              max={2048}
              step={32}
              marks={[
                { value: 32, label: '32' },
                { value: 640, label: '640' },
                { value: 2048, label: '2048' }
              ]}
              sx={{ color: 'primary.main' }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: 1,
              backgroundColor: theme => theme.palette.background.paper,
              boxShadow: theme => `0 0 0 1px ${theme.palette.divider}`,
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: 3
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <i className='tabler-layers-intersect me-2 text-primary'></i>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                Overlap
              </Typography>
            </Box>
            <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 3 }}>
              Overlap between tiles (0-90%)
            </Typography>
            <Typography sx={{ mb: 1 }}>{(config.overlap * 100).toFixed(0)}%</Typography>
            <Slider
              value={config.overlap}
              onChange={(_, value) => onChange('overlap', value)}
              min={0}
              max={0.9}
              step={0.1}
              marks={[
                { value: 0, label: '0%' },
                { value: 0.5, label: '50%' },
                { value: 0.9, label: '90%' }
              ]}
              sx={{ color: 'primary.main' }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: 1,
              backgroundColor: theme => theme.palette.background.paper,
              boxShadow: theme => `0 0 0 1px ${theme.palette.divider}`,
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: 3
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <i className='tabler-gauge me-2 text-primary'></i>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                Confidence Threshold
              </Typography>
            </Box>
            <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 3 }}>
              Minimum confidence level for detection (0-100%)
            </Typography>
            <Typography sx={{ mb: 1 }}>{(config.conf_threshold * 100).toFixed(0)}%</Typography>
            <Slider
              value={config.conf_threshold}
              onChange={(_, value) => onChange('conf_threshold', value)}
              min={0}
              max={1}
              step={0.05}
              marks={[
                { value: 0, label: '0%' },
                { value: 0.5, label: '50%' },
                { value: 1, label: '100%' }
              ]}
              sx={{ color: 'primary.main' }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

const ImageComparison = ({
  originalImage,
  processedImage,
  isProcessing,
  config,
  onConfigChange,
  captureMode,
  onCaptureModeChange,
  videoDevices,
  selectedDevice,
  onDeviceChange,
  videoRef,
  isStreaming,
  onCaptureClick,
  modelType,
  onModelTypeChange
}) => {
  const [openModal, setOpenModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const handleOpenModal = useCallback((image, isProcessed = false) => {
    setSelectedImage(isProcessed ? `http://localhost:8000${image}` : image)
    setOpenModal(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setOpenModal(false)
    setSelectedImage(null)
  }, [])

  return (
    <>
      <Card sx={{ overflow: 'visible' }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <i className='tabler-photo-scan me-2 fs-3 text-primary'></i>
              <Typography variant='h5'>Image Analysis</Typography>
            </Box>
          }
          subheader='Original vs AI Detection'
          action={
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl size='small' sx={{ minWidth: 200 }}>
                <InputLabel>Model Type</InputLabel>
                <Select value={modelType} onChange={e => onModelTypeChange(e.target.value)} label='Model Type'>
                  <MenuItem value='detection'>
                    <i className='tabler-box-multiple me-2'></i>
                    Detection
                  </MenuItem>
                  <MenuItem value='classification'>
                    <i className='tabler-category me-2'></i>
                    Classification
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl size='small' sx={{ minWidth: 200 }}>
                <InputLabel>Capture Mode</InputLabel>
                <Select value={captureMode} onChange={e => onCaptureModeChange(e.target.value)} label='Capture Mode'>
                  <MenuItem value='upload'>
                    <i className='tabler-upload me-2'></i>
                    Upload Image
                  </MenuItem>
                  <MenuItem value='camera'>
                    <i className='tabler-camera me-2'></i>
                    Live Camera
                  </MenuItem>
                </Select>
              </FormControl>

              {captureMode === 'camera' && videoDevices.length > 0 && (
                <FormControl size='small' sx={{ minWidth: 200 }}>
                  <InputLabel>Camera</InputLabel>
                  <Select value={selectedDevice} onChange={e => onDeviceChange(e.target.value)} label='Camera'>
                    {videoDevices.map(device => (
                      <MenuItem key={device.deviceId} value={device.deviceId}>
                        <i className='tabler-device-camera me-2'></i>
                        {device.label || `Camera ${device.deviceId}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          }
          sx={{
            borderBottom: theme => `1px solid ${theme.palette.divider}`,
            backgroundColor: theme => theme.palette.background.default,
            pb: 3
          }}
        />

        <ConfigurationPanel config={config} onChange={onConfigChange} modelType={modelType} />
        <CardContent sx={{ pt: 6 }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: theme => `0 0 0 1px ${theme.palette.divider}`,
                  backgroundColor: theme => theme.palette.background.paper,
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: 3
                  }
                }}
              >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                    <i className={`tabler-${captureMode === 'camera' ? 'camera' : 'photo'} me-2`}></i>
                    {captureMode === 'camera' ? 'Camera Feed' : 'Original Image'}
                  </Typography>
                  {originalImage && !isStreaming && (
                    <IconButton onClick={() => handleOpenModal(originalImage)} size='small'>
                      <i className='tabler-zoom-in'></i>
                    </IconButton>
                  )}
                </Box>
                <Box
                  sx={{
                    position: 'relative',
                    height: 400,
                    backgroundColor: 'background.default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {captureMode === 'camera' && (
                    <video
                      ref={videoRef}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: isStreaming ? 'block' : 'none'
                      }}
                      autoPlay
                      playsInline
                      muted
                    />
                  )}

                  {captureMode === 'camera' && !isStreaming && (
                    <Typography variant='body2' color='text.secondary'>
                      <i className='tabler-camera-off me-2'></i>
                      {selectedDevice ? 'Starting camera stream...' : 'Select a camera to start streaming'}
                    </Typography>
                  )}

                  {captureMode !== 'camera' &&
                    (originalImage ? (
                      <img
                        src={originalImage}
                        alt='Original plant'
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        <i className='tabler-upload me-2'></i>
                        Please upload an image to see results
                      </Typography>
                    ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: theme => `0 0 0 1px ${theme.palette.divider}`,
                  backgroundColor: theme => theme.palette.background.paper,
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: 3
                  }
                }}
              >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                    <i className='tabler-brain me-2'></i>
                    AI Detection
                  </Typography>
                  {processedImage && !isProcessing && (
                    <IconButton onClick={() => handleOpenModal(processedImage, true)} size='small'>
                      <i className='tabler-zoom-in'></i>
                    </IconButton>
                  )}
                </Box>
                <Box sx={{ position: 'relative', height: 400 }}>
                  {isProcessing ? (
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'background.default'
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : processedImage ? (
                    <img
                      src={`http://localhost:8000${processedImage}`}
                      alt='Processed plant'
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'background.default'
                      }}
                    >
                      <Typography variant='body2' color='text.secondary'>
                        <i className='tabler-plant me-2'></i>
                        Please upload an image to see results
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth='xl'
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.default',
            maxHeight: '95vh',
            height: '95vh'
          }
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: 'relative',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {selectedImage && <ImageViewer image={selectedImage} onClose={handleCloseModal} />}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ImageComparison
