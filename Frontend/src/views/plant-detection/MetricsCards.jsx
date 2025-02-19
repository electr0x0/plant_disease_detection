import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'

// Icons mapping for different metrics using Tabler icons
const metricIcons = {
  temperature: 'tabler-temperature',
  humidity: 'tabler-droplet',
  soil_moisture: 'tabler-plant',
  light_intensity: 'tabler-sun',
  soil_ph: 'tabler-test-pipe',
  nitrogen_level: 'tabler-atom',
  phosphorus_level: 'tabler-flask',
  potassium_level: 'tabler-leaf'
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default
}))

const MetricsCards = ({ metrics = [] }) => {
  const getFormattedValue = (value, unit) => {
    return `${value.toFixed(1)} ${unit}`
  }

  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StyledCard>
            <i
              className={`${metricIcons[metric.metric_type] || 'tabler-device-analytics'} fs-3`}
              style={{ marginRight: '16px' }}
            />
            <div>
              <Typography variant='h6' sx={{ mb: 1 }}>
                {metric.metric_type
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </Typography>
              <Typography variant='body1'>{getFormattedValue(metric.value, metric.unit)}</Typography>
            </div>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  )
}

export default MetricsCards
