import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import MetricsCards from '@/views/plant-detection/MetricsCards'
import PlantMetricsChart from '@/views/plant-detection/PlantMetricsChart'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

const PlantMetricsView = () => {
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/plant-metrics')
      if (!response.ok) {
        throw new Error('Failed to fetch metrics')
      }
      const data = await response.json()
      setMetrics(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching metrics:', err)
      setError('Failed to fetch metrics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchMetrics()

    // Set up polling interval (every 5 seconds)
    const interval = setInterval(fetchMetrics, 5000)

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        {error}
      </Alert>
    )
  }

  if (loading || !metrics.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <MetricsCards metrics={metrics} />
      <Box sx={{ mt: 4 }}>
        <PlantMetricsChart metrics={metrics} />
      </Box>
    </Box>
  )
}

export default PlantMetricsView 