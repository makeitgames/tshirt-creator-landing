import React, { useEffect, useState } from 'react'
import { useFetcher, useNavigate } from '@remix-run/react'
import { TextField, Button, Typography, Box, Link } from '@mui/material'
import { useAuth } from '~/contexts/authContext'
import type { ForgotPasswordFormData } from '~/types/form'
import { getFormData } from '~/utils/FormUtils'
import { ForgotPasswordSchema } from '~/schemas/forgot-password'
import type { FirebaseError } from 'firebase/app'

export default function ForgotPasswordForm() {
    const fetcher = useFetcher() // use fetcher instead of normal form submission
    const navigate = useNavigate() // Initialize useNavigate
    const { user, checkEmailExist } = useAuth()
    const [forgotPasswordError, setForgotPasswordError] = useState('')
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
    const [isEnableResendEmail, setIsEnableResendEmail] = useState(false)

    const sendForgotPasswordEmail = async () => {
        // Convert FormData to an object
        const values: ForgotPasswordFormData = getFormData()
        const { email } = values

        // Validate form data with Zod schema
        await ForgotPasswordSchema.parseAsync(values)
            .catch((error) => {
                const formattedErrors = error.errors.reduce(
                    (acc: Record<string, string>, error: any) => {
                        acc[error.path[0]] = error.message
                        return acc
                    },
                    {},
                )
                setFormErrors(formattedErrors)
                setIsEnableResendEmail(false)
            })
            .then(async (result) => {
                if (result !== undefined) {
                    setFormErrors({})
                    setIsEnableResendEmail(true)

                    try {
                        await checkEmailExist(email)
                        // Call forgotPassword
                        fetcher.submit(result, {
                            method: 'post',
                            action: '/forgot-password',
                        })

                        setForgotPasswordError('')
                    } catch (error) {
                        setForgotPasswordError((error as FirebaseError).message)
                    }
                }
            })
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        sendForgotPasswordEmail()
    }

    const handleClickResendEmail = (
        event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) => {
        event.preventDefault()
        sendForgotPasswordEmail()
    }

    useEffect(() => {
        if (user !== null) {
            navigate('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '100vh',
            }}
        >
            <Typography variant="h5" component="h5" gutterBottom>
                Forgot your password?
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, textAlign: 'left' }}>
                Enter your registered email address below to reset your
                password.
            </Typography>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <TextField
                    fullWidth
                    label="Email address"
                    name="email"
                    type="email"
                    variant="outlined"
                    margin="normal"
                    required
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    InputLabelProps={{ shrink: true }}
                    placeholder="Enter email address"
                />
                {isEnableResendEmail && (
                    <Typography
                        sx={{
                            textAlign: 'right',
                            fontSize: '12px',
                            color: '#686868',
                        }}
                    >
                        Didn't receive an email?{' '}
                        <Link
                            component={Button}
                            variant="caption"
                            color="primary"
                            onClick={handleClickResendEmail}
                            sx={{
                                textTransform: 'none',
                                textDecoration: 'none',
                            }}
                        >
                            Send again
                        </Link>
                    </Typography>
                )}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        borderRadius: '1px',
                        fontWeight: 'bold',
                        backgroundColor: '#000',
                        mt: 2,
                    }}
                >
                    Reset password
                </Button>
                {forgotPasswordError && (
                    <Typography
                        color="error"
                        sx={{ mt: 4, textAlign: 'center' }}
                    >
                        {forgotPasswordError}
                    </Typography>
                )}
            </Box>
            <Link
                href="/login"
                underline="always"
                sx={{
                    mt: 4,
                    textAlign: 'center',
                    textTransform: 'none',
                    textDecoration: 'none',
                    '&:hover': { color: 'rgba(83, 160, 160, 0.7)' },
                }}
            >
                I remember the password
            </Link>
        </Box>
    )
}
