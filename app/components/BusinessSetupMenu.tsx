import React from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: 'auto',
}))

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5, 3),
    textTransform: 'none',
    fontSize: '11px',
}))

export default function BusinessSetupMenu({
    onClick,
}: {
    onClick: () => void
}) {
    return (
        <StyledPaper elevation={3}>
            <Box>
                <Typography
                    variant="h6"
                    component="h6"
                    gutterBottom
                    fontWeight="bold"
                    color="white"
                >
                    Business details
                </Typography>
                <Typography variant="body2" color="grey.400" paragraph>
                    You need to be a registered business to proceed with the
                    setup.
                </Typography>
                <StyledButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={onClick}
                >
                    Set up business account
                </StyledButton>
            </Box>
        </StyledPaper>
    )
}
