// React imports
import { forwardRef } from 'react'

// MUI imports
import Autocomplete from '@mui/material/Autocomplete'
import Paper from '@mui/material/Paper'

const CustomAutocomplete = forwardRef((props, ref) => {
  return (
    // eslint-disable-next-line lines-around-comment
    <Autocomplete {...props} ref={ref} PaperComponent={props => <Paper {...props} />} />
  )
})

export default CustomAutocomplete
