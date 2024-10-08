import React, { useState } from 'react'
import { useFetcher, useNavigate } from '@remix-run/react'
import { Button, Typography, Box, TextField } from '@mui/material'
import type { PasswordResetFormData } from '~/types/form'
import { getFormData } from '~/utils/FormUtils'
import { PasswordResetSchema } from '~/schemas/password-reset'
import type { FirebaseError } from 'firebase/app'
import PasswordInput from './PasswordInput'

interface PasswordResetFormProps {
    email: string
    apiKey: string
    actionCode: string
}
export default function PasswordResetForm({
    email,
    apiKey,
    actionCode,
}: PasswordResetFormProps) {
    const fetcher = useFetcher() // use fetcher instead of normal form submission
    const navigate = useNavigate() // Initialize useNavigate
    const [passwordResetError, setPasswordResetError] = useState('')
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
    const [isEnablePasswordReset, setIsEnablePasswordReset] = useState(true)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsEnablePasswordReset(false)

        // Convert FormData to an object
        const values: PasswordResetFormData = getFormData()

        // Validate form data with Zod schema
        await PasswordResetSchema.parseAsync({ ...values, email })
            .catch((error) => {
                const formattedErrors = error.errors.reduce(
                    (acc: Record<string, string>, error: any) => {
                        acc[error.path[0]] = error.message
                        return acc
                    },
                    {},
                )
                setFormErrors(formattedErrors)
            })
            .then(async (result) => {
                if (result !== undefined) {
                    setFormErrors({})

                    try {
                        await fetcher.submit(result, {
                            method: 'post',
                            action: `/password-reset?apiKey=${apiKey}&&actionCode=${actionCode}`,
                        })
                        setPasswordResetError('')
                        navigate('/login')
                    } catch (error) {
                        setPasswordResetError((error as FirebaseError).message)
                    }
                }
            })
    }

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
                Update your password
            </Typography>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    disabled
                    fullWidth
                />
                <PasswordInput
                    name="password"
                    required
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    label="New Password"
                    sx={{ mt: 2 }}
                    placeholder="Enter new password"
                    shrink
                    autoComplete="new-password"
                />
                <PasswordInput
                    name="confirmPassword"
                    required
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                    label="Confirm New Password"
                    sx={{ mt: 2 }}
                    placeholder="Re-enter your password"
                    shrink
                    autoComplete="new-password"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!isEnablePasswordReset}
                    sx={{
                        borderRadius: '1px',
                        fontWeight: 'bold',
                        backgroundColor: '#000',
                        mt: 2,
                    }}
                >
                    Update password
                </Button>
                {passwordResetError && (
                    <Typography
                        color="error"
                        sx={{ mt: 4, textAlign: 'center' }}
                    >
                        {passwordResetError}
                    </Typography>
                )}
            </Box>
        </Box>
    )
}
