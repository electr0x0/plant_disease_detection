'use client'

// React Imports
import React from 'react'

// Mui Imports
import { styled } from '@mui/material'
import MuiChip from '@mui/material/Chip'

const Chip = styled(MuiChip)(({ round }) => {
  return {
    '&': {
      ...(round === 'true' && {
        borderRadius: 16
      })
    }
  }
})

const CustomChip = props => <Chip {...props} />

export default CustomChip
