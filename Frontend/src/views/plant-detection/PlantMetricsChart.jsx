// src/components/plant-detection/PlantMetricsChart.jsx
import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const PlantMetricsChart = ({ metrics = [] }) => {
  const defaultOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      animations: {
        enabled: true
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    grid: {
      borderColor: 'var(--mui-palette-divider)'
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: "MMM 'yy",
          day: 'dd MMM',
          hour: 'HH:mm'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: value => `${value}`
      }
    },
    legend: {
      position: 'top'
    }
  }

  const getSeries = () => {
    if (!metrics.length) return []

    // Group metrics by type
    const groupedMetrics = metrics.reduce((acc, metric) => {
      if (!acc[metric.metric_type]) {
        acc[metric.metric_type] = []
      }

      acc[metric.metric_type].push({
        x: new Date(metric.timestamp).getTime(),
        y: metric.value
      })

      return acc
    }, {})

    // Convert to series format
    return Object.entries(groupedMetrics).map(([type, data]) => ({
      name: type,
      data: data
    }))
  }

  return (
    <Card>
      <CardHeader title='Plant Metrics' subheader='Real-time environmental data' />
      <CardContent>
        {metrics.length > 0 ? (
          <AppReactApexCharts type='line' height={350} options={defaultOptions} series={getSeries()} />
        ) : (
          <Typography variant='body2' color='text.secondary' className='text-center p-4'>
            Waiting for metric data...
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default PlantMetricsChart
