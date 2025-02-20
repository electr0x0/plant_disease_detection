import { motion } from 'framer-motion'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// Icons mapping for different metrics using Tabler icons
const metricIcons = {
  temperature: 'tabler-temperature',
  humidity: 'tabler-droplet',
  soil_moisture: 'tabler-plant',
  light_intensity: 'tabler-sun',
  soil_ph: 'tabler-test-pipe',
  nitrogen_level: 'tabler-leaf',
  phosphorus_level: 'tabler-atom',
  potassium_level: 'tabler-molecule'
}

const MetricCard = ({ metric, icon, color, delay }) => {
  const theme = useTheme()

  const getStatusColor = (type, value) => {
    const ranges = {
      temperature: { low: 18, high: 28 },
      humidity: { low: 40, high: 70 },
      soil_moisture: { low: 30, high: 70 },
      light_intensity: { low: 2000, high: 8000 },
      soil_ph: { low: 6.0, high: 7.0 },
      nitrogen_level: { low: 100, high: 200 },
      phosphorus_level: { low: 20, high: 50 },
      potassium_level: { low: 100, high: 250 }
    }

    const range = ranges[type]
    if (!range) return theme.palette.info.main

    if (value < range.low) return theme.palette.warning.main
    if (value > range.high) return theme.palette.error.main
    return theme.palette.success.main
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        sx={{
          height: '100%',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-4px)',
            transition: 'transform 0.3s ease-in-out'
          }
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: '1rem',
                color: 'text.secondary',
                textTransform: 'capitalize'
              }}
            >
              {metric.metric_type.replace(/_/g, ' ')}
            </Typography>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${color}15`,
                color: color
              }}
            >
              <i className={icon} style={{ fontSize: '1.5rem' }} />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {metric.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {metric.unit}
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 2,
              height: 4,
              borderRadius: 2,
              backgroundColor: 'background.default',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                backgroundColor: getStatusColor(metric.metric_type, metric.value),
                transform: `scaleX(${metric.value / 100})`,
                transformOrigin: 'left',
                transition: 'transform 0.5s ease'
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const MetricsCards = ({ metrics }) => {
  const theme = useTheme()

  const metricConfig = {
    temperature: {
      icon: 'tabler-temperature',
      color: theme.palette.error.main
    },
    humidity: {
      icon: 'tabler-droplet',
      color: theme.palette.info.main
    },
    soil_moisture: {
      icon: 'tabler-plant',
      color: theme.palette.success.main
    },
    light_intensity: {
      icon: 'tabler-sun',
      color: theme.palette.warning.main
    },
    soil_ph: {
      icon: 'tabler-test-pipe',
      color: theme.palette.secondary.main
    },
    nitrogen_level: {
      icon: 'tabler-leaf',
      color: theme.palette.success.main
    },
    phosphorus_level: {
      icon: 'tabler-atom',
      color: theme.palette.info.main
    },
    potassium_level: {
      icon: 'tabler-molecule',
      color: theme.palette.warning.main
    }
  }

  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={metric.metric_type}>
          <MetricCard
            metric={metric}
            icon={metricConfig[metric.metric_type].icon}
            color={metricConfig[metric.metric_type].color}
            delay={index * 0.1}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default MetricsCards
