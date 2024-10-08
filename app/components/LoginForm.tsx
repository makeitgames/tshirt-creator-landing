import {
    TextField,
    Button,
    Typography,
    Box,
    Link,
    Divider,
} from '@mui/material'
import { useNavigate } from '@remix-run/react'
import type { FirebaseError } from 'firebase/app'
import { useEffect, useState } from 'react'
import { useAuth } from '~/contexts/authContext'
import { LoginSchema } from '~/schemas/login'
import type { LoginFormData } from '~/types/form'
import { getFormData } from '~/utils/FormUtils'
import PasswordInput from './PasswordInput'

const LoginForm = () => {
    const [isOnline, setIsOnline] = useState(true)
    const navigate = useNavigate() // Initialize useNavigate
    const { login, user } = useAuth()
    const [loginError, setLoginError] = useState('')
    const [isSubmitable, setIsSubmitable] = useState(true)
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

    useEffect(() => {
        // Check if the code is running in the browser
        if (typeof window !== 'undefined') {
            setIsOnline(navigator.onLine)

            const handleOnline = () => setIsOnline(true)
            const handleOffline = () => setIsOnline(false)

            window.addEventListener('online', handleOnline)
            window.addEventListener('offline', handleOffline)

            // Cleanup event listeners on unmount
            return () => {
                window.removeEventListener('online', handleOnline)
                window.removeEventListener('offline', handleOffline)
            }
        }
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitable(false)
        // Convert FormData to an object
        const values: LoginFormData = getFormData()
        const { email, password } = values

        const result = LoginSchema.safeParse(values)

        if (!result.success) {
            const formattedErrors = result.error.errors.reduce(
                (acc, error) => {
                    acc[error.path[0]] = error.message
                    return acc
                },
                {} as { [key: string]: string },
            )

            setFormErrors(formattedErrors)
            setIsSubmitable(true)
        } else {
            setFormErrors({})

            try {
                await login(email, password)
                setLoginError('')
                setIsSubmitable(true)
            } catch (error) {
                setLoginError((error as FirebaseError).message)
                setIsSubmitable(true)
            }
        }
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
                mx: 'auto',
                mt: 4,
                p: 2,
                textAlign: 'center',
            }}
        >
            <Box
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                <TextField
                    label="Email"
                    name="email"
                    required
                    fullWidth
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    margin="normal"
                    placeholder="Exemple@gmail.com"
                    InputLabelProps={{ shrink: true }}
                />

                <PasswordInput
                    name="password"
                    required
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    label="Password"
                    sx={{ mt: 2 }}
                    placeholder="Enter your password"
                    shrink
                    autoComplete="on"
                />
                <Link
                    component={Button}
                    href="/forgot-password"
                    variant="caption"
                    color="primary"
                    sx={{
                        float: 'right',
                        textTransform: 'none',
                        textDecoration: 'none',
                    }}
                >
                    Forgot Password?
                </Link>
                <Button
                    sx={{ mt: 4, borderRadius: '1px', backgroundColor: '#000' }}
                    type="submit"
                    variant="contained"
                    disabled={!isSubmitable}
                    fullWidth
                >
                    Login
                </Button>
                {loginError && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {isOnline
                            ? loginError
                            : 'Please check your internet connection again.'}
                    </Typography>
                )}
            </Box>

            <Typography
                variant="caption"
                display="block"
                gutterBottom
                sx={{ mt: 2, textAlign: 'center', color: '#686868' }}
            >
                Don't have an account?{' '}
                <Link
                    component={Button}
                    href="/signup"
                    variant="caption"
                    color="primary"
                    sx={{ textTransform: 'none', textDecoration: 'none' }}
                >
                    Sign Up here
                </Link>
            </Typography>

            <Divider
                orientation="horizontal"
                variant="middle"
                flexItem
                sx={{ mt: 4 }}
            />

            <Typography
                variant="caption"
                display="block"
                gutterBottom
                sx={{ mt: 2, textAlign: 'center', color: '#686868' }}
            >
                Having trouble logging in or need help?{' '}
                <Link
                    component={Button}
                    href="/#contact-us"
                    variant="caption"
                    color="primary"
                    sx={{ textTransform: 'none', textDecoration: 'none' }}
                >
                    Contact Us
                </Link>
            </Typography>
        </Box>
    )
}

export default LoginForm
