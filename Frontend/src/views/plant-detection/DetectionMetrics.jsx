// src/components/plant-detection/DetectionMetrics.jsx
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

const DetectionMetrics = ({ detections = [] }) => {
  return (
    <Card>
      <CardHeader title='Detection Results' subheader='Disease Confidence Scores' />
      <CardContent>
        {detections.length > 0 ? (
          detections.map((detection, index) => (
            <div key={index} className='mbe-4'>
              <div className='flex justify-between mbe-1'>
                <Typography>{detection.class}</Typography>
                <Typography>{Math.round(detection.confidence * 100)}%</Typography>
              </div>
              <LinearProgress
                variant='determinate'
                value={detection.confidence * 100}
                color={detection.confidence > 0.7 ? 'error' : 'warning'}
                className='bs-2'
              />
            </div>
          ))
        ) : (
          <Typography variant='body2' color='text.secondary' className='text-center p-4'>
            Upload an image to see detection results
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default DetectionMetrics
