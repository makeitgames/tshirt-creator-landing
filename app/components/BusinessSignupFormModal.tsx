import React, { useEffect, useRef, useState } from 'react'
import {
    Modal,
    Box,
    Stepper,
    Step,
    StepLabel,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    OutlinedInput,
    styled,
} from '@mui/material'
import countryData from 'country-region-data/data.json'
import PhoneInput from './PhoneNumberInput'
import { ContactInfoSchema } from '~/schemas/contact-info'
import type {
    BrandInfoFormData,
    BusinessInfoFormData,
    ContactInfoFormData,
} from '~/types/form'
import { BusinessInfoSchema } from '~/schemas/business-info'
import { BrandInfoSchema } from '~/schemas/brand-info'
import { useFetcher } from '@remix-run/react'
import { useAuth } from '~/contexts/authContext'

const steps = ['Contact Information', 'Business details', 'Create a brand']

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
})

export default function BusinessSignupFormModal({
    open = false,
    onClose,
    onFormComplete,
}: {
    open: boolean
    onClose: () => void
    onFormComplete: () => void
}) {
    const { user } = useAuth()
    const fetcher = useFetcher() // use fetcher instead of normal form submission
    const [activeStep, setActiveStep] = useState(0)
    const [isOpen, setIsOpen] = useState(open)
    const defaultContactData: ContactInfoFormData = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        phonePrefix: '',
        phoneCountryCode: '',
        country: 'TH',
        street: '',
        streetNumber: '',
        postalCode: '',
        city: '',
        useInvoicingEmail: false,
        invoicingEmail: '',
    }
    const [formContactData, setFormContactData] =
        useState<ContactInfoFormData>(defaultContactData)
    const defaultBusinessData: BusinessInfoFormData = {
        taxCountry: 'TH',
        businessName: '',
        organizationNumber: '',
        proofOfBusiness: undefined,
    }
    const [formBusinessData, setFormBusinessData] =
        useState<BusinessInfoFormData>(defaultBusinessData)
    const defaultBrandData: BrandInfoFormData = {
        brandName: '',
        agreeToTermsAndPolicies: false,
    }
    const [formBrandData, setFormBrandData] =
        useState<BrandInfoFormData>(defaultBrandData)
    const [isShowInvoicingEmail, setIsShowInvoicingEmail] = useState(false)
    const [errors, setErrors] = useState({
        contact: {} as Record<string, string>,
        business: {} as Record<string, string>,
        brand: {} as Record<string, string>,
    })
    const phoneInputRef = useRef<{ resetPhoneNumber: () => void }>(null)

    useEffect(() => {
        setIsOpen(open)
    }, [open])

    useEffect(() => {
        if (!formContactData.useInvoicingEmail && formContactData.email) {
            setFormContactData((prevData) => ({
                ...prevData,
                invoicingEmail: formContactData.email,
            }))
        }
    }, [formContactData.useInvoicingEmail, formContactData.email])

    useEffect(() => {
        if (formContactData.useInvoicingEmail) {
            setIsShowInvoicingEmail(true)
        }
    }, [formContactData.useInvoicingEmail])

    useEffect(() => {
        if (activeStep === steps.length) {
            handleRegistrationComplete()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeStep])

    const validateContactData = () => {
        let formattedErrors = {}
        // Use Zod's safeParse to validate formContactData
        const result = ContactInfoSchema.safeParse(formContactData)

        if (!result.success) {
            formattedErrors = result.error.errors.reduce(
                (acc, error) => {
                    acc[error.path[0]] = error.message
                    return acc
                },
                {} as { [key: string]: string },
            )

            setErrors((prev) => ({ ...prev, contact: formattedErrors }))
            return false // Validation failed
        }

        setErrors((prev) => ({ ...prev, contact: {} })) // Clear any previous errors
        return Object.keys(formattedErrors).length === 0 // Validation passed
    }

    const validateBusinessData = () => {
        let formattedErrors = {}
        // Use Zod's safeParse to validate formContactData
        const result = BusinessInfoSchema.safeParse(formBusinessData)

        if (!result.success) {
            formattedErrors = result.error.errors.reduce(
                (acc, error) => {
                    acc[error.path[0]] = error.message
                    return acc
                },
                {} as { [key: string]: string },
            )

            setErrors((prev) => ({ ...prev, business: formattedErrors }))
            return false // Validation failed
        }

        setErrors((prev) => ({ ...prev, business: {} })) // Clear any previous errors
        return Object.keys(formattedErrors).length === 0 // Validation passed
    }

    const validateBrandData = () => {
        let formattedErrors = {}
        // Use Zod's safeParse to validate formContactData
        const result = BrandInfoSchema.safeParse(formBrandData)

        if (!result.success) {
            formattedErrors = result.error.errors.reduce(
                (acc, error) => {
                    acc[error.path[0]] = error.message
                    return acc
                },
                {} as { [key: string]: string },
            )

            setErrors((prev) => ({ ...prev, brand: formattedErrors }))
            return false // Validation failed
        }

        setErrors((prev) => ({ ...prev, brand: {} })) // Clear any previous errors
        return Object.keys(formattedErrors).length === 0 // Validation passed
    }

    const handleNext = () => {
        let isValid = false
        switch (activeStep) {
            case 0:
                isValid = validateContactData()
                break
            case 1:
                isValid = validateBusinessData()
                break
            case 2:
                isValid = validateBrandData()
                break
            default:
                isValid = true
        }

        if (isValid) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1)
        }
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleContactDataChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value, checked } = event.target
        setFormContactData((prevData) => ({
            ...prevData,
            [name]: name === 'useInvoicingEmail' ? checked : value,
        }))
    }

    const handleBusinessDataChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = event.target
        setFormBusinessData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleBrandDataChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value, checked } = event.target
        setFormBrandData((prevData) => ({
            ...prevData,
            [name]: name === 'agreeToTermsAndPolicies' ? checked : value,
        }))
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFormBusinessData((prevData) => ({
                ...prevData,
                proofOfBusiness: event.target.files![0],
            }))
        }
    }

    const handleRegistrationComplete = () => {
        // Combine all form data into FormData
        const completeFormData = new FormData()
        completeFormData.append(
            'formContactData',
            JSON.stringify(formContactData),
        )
        completeFormData.append(
            'formBusinessData',
            JSON.stringify({
                ...formBusinessData,
                proofOfBusiness: formBusinessData.proofOfBusiness
                    ? formBusinessData.proofOfBusiness.name
                    : undefined,
            }),
        )
        completeFormData.append('formBrandData', JSON.stringify(formBrandData))
        completeFormData.append('userId', user?.uid ?? '')

        if (formBusinessData.proofOfBusiness) {
            completeFormData.append(
                'proofOfBusiness',
                formBusinessData.proofOfBusiness,
            )
        }

        setIsOpen(false)
        onFormComplete()
        setActiveStep(0)
        setFormContactData(defaultContactData)
        setFormBusinessData(defaultBusinessData)
        setFormBrandData(defaultBrandData)
        fetcher.submit(completeFormData, {
            method: 'post',
            action: '/business-signup',
            encType: 'multipart/form-data',
        })
    }

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <Typography variant="h6">
                            Contact Information
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="firstName"
                                label="First name"
                                value={formContactData.firstName}
                                onChange={handleContactDataChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.contact.firstName}
                                helperText={errors.contact.firstName}
                            />
                            <TextField
                                name="lastName"
                                label="Last name"
                                value={formContactData.lastName}
                                onChange={handleContactDataChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.contact.lastName}
                                helperText={errors.contact.lastName}
                            />
                        </Box>
                        <TextField
                            name="email"
                            label="E-mail"
                            type="email"
                            value={formContactData.email}
                            onChange={handleContactDataChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.contact.email}
                            helperText={errors.contact.email}
                        />
                        <PhoneInput
                            label="Phone"
                            name="phoneNumber"
                            ref={phoneInputRef}
                            error={!!errors.contact.phoneNumber}
                            helperText={errors.contact.phoneNumber}
                            value={formContactData.phoneNumber}
                            onPhoneNumberChange={(value) =>
                                setFormContactData((prevData) => ({
                                    ...prevData,
                                    phoneNumber: value,
                                }))
                            }
                            onPhonePrefixChange={(value) =>
                                setFormContactData((prevData) => ({
                                    ...prevData,
                                    phonePrefix: value,
                                }))
                            }
                            onPhoneCountryChange={(value) =>
                                setFormContactData((prevData) => ({
                                    ...prevData,
                                    phoneCountryCode: value,
                                }))
                            }
                            specificCountry={formContactData.country}
                        />
                        <FormControl fullWidth error={!!errors.contact.country}>
                            <InputLabel
                                htmlFor="select-input"
                                id="country-label"
                                shrink
                            >
                                Country/Region
                            </InputLabel>
                            <Select
                                labelId="country-label"
                                name="countryCode"
                                value={formContactData.country}
                                onChange={(event) =>
                                    setFormContactData((prevData) => ({
                                        ...prevData,
                                        country: event.target.value as string,
                                    }))
                                }
                                label="Country/Region"
                                input={
                                    <OutlinedInput
                                        notched
                                        label="Country/Region"
                                        id="select-input"
                                    />
                                }
                            >
                                {countryData.map((country) => (
                                    <MenuItem
                                        key={country.countryShortCode}
                                        value={country.countryShortCode}
                                    >
                                        {country.countryName}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.contact.countryCode && (
                                <Typography color="error" variant="caption">
                                    {errors.contact.country}
                                </Typography>
                            )}
                        </FormControl>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="street"
                                label="Street"
                                value={formContactData.street}
                                onChange={handleContactDataChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.contact.street}
                                helperText={errors.contact.street}
                            />
                            <TextField
                                name="streetNumber"
                                label="Street number"
                                value={formContactData.streetNumber}
                                onChange={handleContactDataChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.contact.streetNumber}
                                helperText={errors.contact.streetNumber}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="postalCode"
                                label="Postal code"
                                value={formContactData.postalCode}
                                onChange={handleContactDataChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.contact.postalCode}
                                helperText={errors.contact.postalCode}
                            />
                            <TextField
                                name="city"
                                label="City"
                                value={formContactData.city}
                                onChange={handleContactDataChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.contact.city}
                                helperText={errors.contact.city}
                            />
                        </Box>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="useInvoicingEmail"
                                    checked={formContactData.useInvoicingEmail}
                                    onChange={handleContactDataChange}
                                    sx={{
                                        color: '#000',
                                        '&.Mui-checked': { color: '#000' },
                                    }}
                                />
                            }
                            label="Use different email for invoicing"
                            sx={{ color: '#797979' }}
                        />
                        {isShowInvoicingEmail && (
                            <TextField
                                name="invoicingEmail"
                                label="Invoicing E-mail"
                                type="email"
                                value={formContactData.invoicingEmail}
                                onChange={handleContactDataChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.contact.invoicingEmail}
                                helperText={errors.contact.invoicingEmail}
                            />
                        )}
                    </Box>
                )
            case 1:
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Enter your official registered company details
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: '#aaa', mb: 2 }}
                        >
                            Let's begin with the basics so we know who you are
                            and where your business is based.
                        </Typography>
                        <FormControl
                            fullWidth
                            error={!!errors.business.taxCountry}
                        >
                            <InputLabel
                                htmlFor="select-input"
                                id="tax-country-label"
                                shrink
                            >
                                Tax registered country
                            </InputLabel>
                            <Select
                                labelId="tax-country-label"
                                label="Tax registered country"
                                name="taxCountry"
                                value={formBusinessData.taxCountry}
                                onChange={(event) =>
                                    setFormBusinessData((prevData) => ({
                                        ...prevData,
                                        taxCountry: event.target
                                            .value as string,
                                    }))
                                }
                                input={
                                    <OutlinedInput
                                        notched
                                        label="Tax registered country"
                                        id="select-input"
                                    />
                                }
                            >
                                {countryData.map((country) => (
                                    <MenuItem
                                        key={country.countryShortCode}
                                        value={country.countryShortCode}
                                    >
                                        {country.countryName}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.business.taxCountry && (
                                <Typography color="error" variant="caption">
                                    {errors.business.taxCountry}
                                </Typography>
                            )}
                        </FormControl>
                        <Typography
                            variant="body2"
                            sx={{ color: '#aaa', mt: 2, mb: 1 }}
                        >
                            Please provide your legally registered business
                            name, and optionally, include your organisation
                            number if applicable.
                        </Typography>
                        <TextField
                            fullWidth
                            label="Business name"
                            variant="outlined"
                            name="businessName"
                            InputLabelProps={{ shrink: true }}
                            value={formBusinessData.businessName}
                            onChange={handleBusinessDataChange}
                            error={!!errors.business.businessName}
                            helperText={errors.business.businessName}
                        />
                        <TextField
                            fullWidth
                            label="Organisation number"
                            variant="outlined"
                            name="organizationNumber"
                            InputLabelProps={{ shrink: true }}
                            value={formBusinessData.organizationNumber}
                            onChange={handleBusinessDataChange}
                        />
                        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                            Proof of business
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: '#aaa', mb: 2 }}
                        >
                            Add your proof of business documentation so we can
                            confirm your details.
                        </Typography>
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<>📎</>}
                            sx={{
                                color: '#555',
                                borderColor: '#555',
                                '&:hover': {
                                    borderColor: '#777',
                                },
                            }}
                        >
                            Upload document
                            <VisuallyHiddenInput
                                type="file"
                                onChange={handleFileUpload}
                            />
                        </Button>
                        {formBusinessData.proofOfBusiness && (
                            <Typography
                                variant="body2"
                                sx={{ color: '#aaa', mt: 1 }}
                            >
                                File selected:{' '}
                                {formBusinessData.proofOfBusiness.name}
                            </Typography>
                        )}
                        {errors.business.proofOfBusiness && (
                            <Typography color="error" variant="caption">
                                {errors.business.proofOfBusiness}
                            </Typography>
                        )}
                    </Box>
                )
            case 2:
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 1 }}>
                            Create a brand
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: '#aaa', mb: 2 }}
                        >
                            Add your first brand to your business account. You
                            can edit and add more once your business account is
                            setup and verified. This setting is private and
                            won't be visible to your end customers.
                        </Typography>
                        <TextField
                            fullWidth
                            name="brandName"
                            label="Give your brand a name"
                            variant="outlined"
                            value={formBrandData.brandName}
                            onChange={handleBrandDataChange}
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.brand.brandName}
                            helperText={errors.brand.brandName}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="agreeToTermsAndPolicies"
                                    checked={
                                        formBrandData.agreeToTermsAndPolicies
                                    }
                                    onChange={handleBrandDataChange}
                                    sx={{
                                        color: '#aaa',
                                        '&.Mui-checked': {
                                            color: '#000',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#aaa' }}
                                >
                                    I agree to the Creator Studio business to
                                    business terms and conditions & content
                                    policy
                                </Typography>
                            }
                        />
                        {errors.brand.agreeToTermsAndPolicies && (
                            <Typography color="error" variant="caption">
                                {errors.brand.agreeToTermsAndPolicies}
                            </Typography>
                        )}
                    </Box>
                )
            default:
                break
        }
    }

    const handleCloseModal = () => {
        setIsOpen(false)
        onClose()
        setActiveStep(0)
        setFormContactData(defaultContactData)
        setFormBusinessData(defaultBusinessData)
        setFormBrandData(defaultBrandData)
    }

    return (
        <div>
            <Modal
                open={isOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 800,
                        bgcolor: '#fff',
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                    }}
                >
                    <Box
                        sx={{
                            width: '30%',
                            borderRight: '1px solid #9e9e9e',
                            pr: 2,
                        }}
                    >
                        <Typography
                            id="modal-title"
                            variant="h6"
                            component="h2"
                            sx={{ mb: 2, color: '#000' }}
                        >
                            SETTING UP YOUR COMPANY
                        </Typography>
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel
                                        StepIconProps={{
                                            sx: {
                                                color: '#9e9e9e',
                                                '&.Mui-active': {
                                                    color: '#5cc43f',
                                                },
                                                '&.Mui-completed': {
                                                    color: '#5cc43f',
                                                },
                                            },
                                        }}
                                    >
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                    <Box sx={{ width: '70%', pl: 2 }}>
                        <>
                            {getStepContent(activeStep)}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    mt: 2,
                                }}
                            >
                                <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{
                                        mr: 1,
                                        color: '#4b4b4b',
                                        width: '40%',
                                        textTransform: 'none',
                                    }}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{
                                        width: '60%',
                                        backgroundColor: '#000',
                                        borderRadius: '1px',
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: '#4b4b4b',
                                        },
                                    }}
                                >
                                    {activeStep === steps.length - 1
                                        ? 'Complete registration'
                                        : 'Continue'}
                                </Button>
                            </Box>
                        </>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}
