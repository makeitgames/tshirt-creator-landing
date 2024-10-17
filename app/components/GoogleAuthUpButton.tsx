import React from 'react'
import { Button, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useAuth } from '~/contexts/authContext'

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#f0f2f5',
    color: '#1c1e21',
    padding: theme.spacing(1, 2),
    textTransform: 'none',
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        backgroundColor: '#e4e6eb',
    },
}))

export default function GoogleAuthUpButton({
    title = '',
    sx = {},
}: {
    title: string
    sx?: {}
}) {
    const { socialLogin } = useAuth()
    const handleGoogleSignIn = async () => {
        await socialLogin('google')
    }
    return (
        <StyledButton
            sx={sx}
            onClick={handleGoogleSignIn}
            variant="contained"
            startIcon={
                <img
                    src="/assets/icons/google-logo.svg"
                    alt="Logo"
                    style={{ width: '1em', height: '1em' }}
                />
            }
        >
            <Typography variant="body1">{title}</Typography>
        </StyledButton>
    )
}
