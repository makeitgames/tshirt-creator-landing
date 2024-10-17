import React from 'react'
import { Button, Typography } from '@mui/material'
import { styled } from '@mui/system'
import FacebookIcon from '@mui/icons-material/Facebook'
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

export default function FacebookAuthButton({
    title = '',
    sx = {},
}: {
    title: string
    sx?: {}
}) {
    const { socialLogin } = useAuth()
    const handleFacebookSignIn = async () => {
        await socialLogin('facebook')
    }
    return (
        <StyledButton
            sx={sx}
            onClick={handleFacebookSignIn}
            variant="contained"
            startIcon={<FacebookIcon style={{ color: '#1877f2' }} />}
        >
            <Typography variant="body1">{title}</Typography>
        </StyledButton>
    )
}
