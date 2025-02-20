// src/components/plant-detection/PlantMetricsChart.jsx
import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

const PlantMetricsChart = ({ metrics }) => {
  const theme = useTheme()
  const [selectedMetrics, setSelectedMetrics] = useState(['temperature', 'humidity'])
  const [chartData, setChartData] = useState([])

  // Keep track of historical data
  useEffect(() => {
    if (!metrics.length) return

    setChartData(prev => {
      const timestamp = new Date().toLocaleTimeString()
      const newDataPoint = {
        timestamp,
        ...metrics.reduce((acc, metric) => {
          acc[metric.metric_type] = metric.value
          return acc
        }, {})
      }

      // Keep last 10 data points
      const updatedData = [...prev, newDataPoint].slice(-10)
      return updatedData
    })
  }, [metrics])

  const getMetricColor = (metricType) => {
    const colors = {
      temperature: theme.palette.error.main,
      humidity: theme.palette.info.main,
      soil_moisture: theme.palette.success.main,
      light_intensity: theme.palette.warning.main,
      soil_ph: theme.palette.secondary.main,
      nitrogen_level: theme.palette.success.light,
      phosphorus_level: theme.palette.info.light,
      potassium_level: theme.palette.warning.light
    }
    return colors[metricType] || theme.palette.primary.main
  }

  const metricLabels = {
    temperature: 'Temperature (°C)',
    humidity: 'Humidity (%)',
    soil_moisture: 'Soil Moisture (%)',
    light_intensity: 'Light (lux)',
    soil_ph: 'Soil pH',
    nitrogen_level: 'Nitrogen (ppm)',
    phosphorus_level: 'Phosphorus (ppm)',
    potassium_level: 'Potassium (ppm)'
  }

  const handleMetricChange = (event) => {
    setSelectedMetrics(event.target.value)
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Real-time Metrics</Typography>
          <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
            <InputLabel>Select Metrics</InputLabel>
            <Select
              multiple
              value={selectedMetrics}
              onChange={handleMetricChange}
              label="Select Metrics"
              renderValue={(selected) => selected.map(s => metricLabels[s].split(' ')[0]).join(', ')}
            >
              {Object.entries(metricLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ height: 400, width: '100%' }}>
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.palette.divider}
              />
              <XAxis
                dataKey="timestamp"
                stroke={theme.palette.text.secondary}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8
                }}
                labelStyle={{ color: theme.palette.text.primary }}
              />
              <Legend />
              {selectedMetrics.map(metricType => (
                <Line
                  key={metricType}
                  type="monotone"
                  dataKey={metricType}
                  name={metricLabels[metricType]}
                  stroke={getMetricColor(metricType)}
                  strokeWidth={2}
                  dot={{ r: 4, fill: getMetricColor(metricType) }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export default PlantMetricsChart
