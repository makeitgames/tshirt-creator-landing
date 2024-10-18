import {
    TextField,
    Button,
    Typography,
    Box,
    FormControl,
    FormControlLabel,
    Checkbox,
    Link,
    Grid,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getFormData } from '~/utils/FormUtils'
import PasswordInput from './PasswordInput'
import { SignupSchema } from '~/schemas/signup'
import type { SignupFormData } from '~/types/form'
import { useAuth } from '~/contexts/AuthContext'
import { useNavigate } from '@remix-run/react'
import FacebookAuthButton from './FacebookAuthButton'
import GoogleAuthUpButton from './GoogleAuthUpButton'

const SignUpForm = () => {
    const navigate = useNavigate() // Initialize useNavigate
    const { login, register, user } = useAuth()
    const [signupError, setSignupError] = useState('')
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
    const [checkboxChecked, setCheckboxChecked] = useState(false)
    const [isSubmitable, setIsSubmitable] = useState(true)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitable(false)
        // Convert FormData to an object
        const values: SignupFormData = getFormData()

        // Validate form data with Zod schema
        await SignupSchema.parseAsync(values)
            .catch((error) => {
                const formattedErrors = error.errors.reduce(
                    (acc: Record<string, string>, error: any) => {
                        acc[error.path[0]] = error.message
                        return acc
                    },
                    {},
                )
                setFormErrors(formattedErrors)
                setIsSubmitable(true)
            })
            .then(async (result) => {
                if (result !== undefined) {
                    setFormErrors({})

                    try {
                        const {
                            fullName,
                            email,
                            password,
                            promotionSubscibe,
                            // username,
                        } = values

                        await register(
                            email,
                            password,
                            fullName,
                            promotionSubscibe,
                        )

                        // login
                        await login(email, password)
                            .catch((error) => {
                                setIsSubmitable(true)
                                throw new Error(error)
                            })
                            .finally(async () => {
                                setSignupError('') // Reset signup error
                                setIsSubmitable(true)
                                navigate('/')
                            })
                    } catch (error) {
                        setSignupError((error as Error).message)
                        setIsSubmitable(true)
                    }
                }
            })
    }

    useEffect(() => {
        if (user !== null) {
            navigate('/dashboard')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <Box
            sx={{
                mx: 'auto',
                mt: 4,
                p: 2,
            }}
        >
            <Typography variant="overline" display="block" gutterBottom>
                LET'S GET STARTED
            </Typography>
            <Typography variant="h5" component="h1" gutterBottom>
                Sign up to Creator T-Shirt
            </Typography>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                {/* <TextField
                    type="text"
                    label="Username"
                    name="username"
                    required
                    fullWidth
                    error={!!formErrors.username}
                    helperText={formErrors.username}
                    autoComplete="name"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    placeholder="Enter your username"
                /> */}
                <TextField
                    type="text"
                    label="Full name"
                    name="fullName"
                    required
                    fullWidth
                    error={!!formErrors.fullName}
                    helperText={formErrors.fullName}
                    autoComplete="name"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    placeholder="Enter your full name"
                />
                <TextField
                    type="email"
                    label="Email"
                    name="email"
                    required
                    fullWidth
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    autoComplete="email"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    placeholder="exemple@gmail.com"
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
                    autoComplete="new-password"
                />
                <Typography
                    variant="caption"
                    display="block"
                    gutterBottom
                    sx={{ mt: 1 }}
                >
                    Your password needs to be at least 8 characters including at
                    least 3 of the following 4 types of characters: a lower case
                    letter, an upper case letter, a number, a special character
                    (such as !@#$%&).
                </Typography>
                <PasswordInput
                    name="confirmPassword"
                    required
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                    label="Confirm password"
                    sx={{ mt: 2 }}
                    placeholder="Re-enter your password"
                    shrink
                    autoComplete="new-password"
                />

                <FormControl
                    error={!!formErrors.promotionSubscibe}
                    component="fieldset"
                    margin="normal"
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="promotionSubscibe"
                                checked={checkboxChecked}
                                onChange={(e) =>
                                    setCheckboxChecked(e.target.checked)
                                }
                            />
                        }
                        label={
                            <Typography
                                variant="caption"
                                display="block"
                                gutterBottom
                            >
                                I would like to receive personalized promotions
                                from Creator T-Shirt, a brand of the VIBAL
                                Group. I confirm that I'm xx years or older. I
                                consent to let VIBAL Group process my personal
                                data to provide me with personalized email and
                                text messages in accordance with the privacy
                                notice.
                            </Typography>
                        }
                    />
                </FormControl>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                        borderRadius: '1px',
                        fontWeight: 'bold',
                        backgroundColor: '#000',
                        mt: 2,
                    }}
                    disabled={!isSubmitable}
                >
                    Continue
                </Button>

                {signupError && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {signupError}
                    </Typography>
                )}
            </Box>
            <Typography
                variant="caption"
                display="block"
                gutterBottom
                sx={{ mt: 2, textAlign: 'center' }}
            >
                Already a creator?{' '}
                <Link
                    component={Button}
                    href="/login"
                    variant="caption"
                    color="primary"
                    sx={{ textTransform: 'none', textDecoration: 'none' }}
                >
                    Log in here
                </Link>
            </Typography>
            <Grid
                container
                spacing={2}
                sx={{ p: { md: '40px 90px', sm: '40px 20px' } }}
            >
                <Grid item xs={12}>
                    <FacebookAuthButton
                        title="Sign up with Facebook"
                        sx={{ width: '100%' }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <GoogleAuthUpButton
                        title="Sign up with Google"
                        sx={{ width: '100%' }}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default SignUpForm
