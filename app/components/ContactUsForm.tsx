import React, { useRef, useState } from 'react'
import { Form, useFetcher } from '@remix-run/react'
import {
    TextField,
    Checkbox,
    Button,
    Grid,
    FormControlLabel,
    Typography,
    Link,
    Box,
    FormControl,
    FormHelperText,
} from '@mui/material'
import PhoneInput from './PhoneNumberInput'
import { ContactUsFormSchema } from '../schemas/contact-us'
import type { ContactUsFormData } from '~/types/form'

export default function ContactUsForm() {
    const fetcher = useFetcher() // use fetcher instead of normal form submission
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
    const [checkboxChecked, setCheckboxChecked] = useState(false)
    const phoneInputRef = useRef<{ resetPhoneNumber: () => void }>(null)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault() // Prevent form submission

        // Create a FormData object
        const form = document.querySelector('form') as HTMLFormElement
        const formData = new FormData(form)
        let isFormValid: boolean = false

        // Convert FormData to an object
        const values: ContactUsFormData = Object.fromEntries(
            formData.entries(),
        ) as unknown

        const result = ContactUsFormSchema.safeParse(values)

        if (!result.success) {
            const formattedErrors = result.error.errors.reduce(
                (acc, error) => {
                    acc[error.path[0]] = error.message
                    return acc
                },
                {} as { [key: string]: string },
            )

            setFormErrors(formattedErrors)
        } else {
            setFormErrors({})
            isFormValid = true
        }

        if (isFormValid) {
            form.reset()

            // Reset phone input
            phoneInputRef.current?.resetPhoneNumber()

            // Reset checkbox
            setCheckboxChecked(false)
            setShowSuccessMessage(true)
            fetcher.submit(formData, {
                method: 'post',
                action: '/contact-us',
            })
        }
    }

    return (
        <Box
            id="contact-us"
            sx={{
                maxWidth: '80%',
                margin: 'auto',
                padding: 2,
                height: '480px',
            }}
        >
            {showSuccessMessage ? (
                <Grid
                    container
                    sx={{
                        padding: '100px 0',
                        color: '#000',
                    }}
                >
                    <Grid item xs={12}>
                        <Typography variant="h4" component="h2" gutterBottom>
                            thanks for the info!
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" paragraph>
                            we will get in touch soon!
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ padding: '10px 0' }}>
                        <Button
                            variant="contained"
                            sx={{
                                color: '#fff',
                                backgroundColor: '#000',
                                borderRadius: '1px',
                                width: '100px',
                            }}
                            onClick={() => setShowSuccessMessage(false)}
                        >
                            OK
                        </Button>
                    </Grid>
                </Grid>
            ) : (
                <Form method="post" action="/contact-us">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                InputLabelProps={{ shrink: true }}
                                placeholder="Enter your first name"
                                fullWidth
                                label="First Name"
                                name="firstName"
                                variant="outlined"
                                error={!!formErrors.firstName}
                                helperText={formErrors.firstName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                InputLabelProps={{ shrink: true }}
                                placeholder="Enter your last name"
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                variant="outlined"
                                error={!!formErrors.lastName}
                                helperText={formErrors.lastName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                InputLabelProps={{ shrink: true }}
                                placeholder="Enter your company name"
                                fullWidth
                                label="Company"
                                name="company"
                                variant="outlined"
                                error={!!formErrors.company}
                                helperText={formErrors.company}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                InputLabelProps={{ shrink: true }}
                                placeholder="example@gmail.com"
                                fullWidth
                                label="E-mail"
                                name="email"
                                type="email"
                                variant="outlined"
                                error={!!formErrors.email}
                                helperText={formErrors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <PhoneInput
                                ref={phoneInputRef}
                                error={!!formErrors.phoneNumber}
                                helperText={formErrors.phoneNumber}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl
                                error={!!formErrors.agreeToPolicy}
                                component="fieldset"
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="agreeToPolicy"
                                            checked={checkboxChecked}
                                            onChange={(e) =>
                                                setCheckboxChecked(
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                    }
                                    label={
                                        <Typography
                                            variant="body2"
                                            style={{ color: '#000' }}
                                        >
                                            You agree to our friendly{' '}
                                            <Link href="#" underline="always">
                                                Privacy Policy
                                            </Link>
                                        </Typography>
                                    }
                                />
                                <FormHelperText>
                                    {formErrors.agreeToPolicy}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                onClick={handleSubmit}
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    },
                                }}
                            >
                                Contact us
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Box>
    )
}
