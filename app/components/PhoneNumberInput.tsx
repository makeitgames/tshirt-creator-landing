import React, {
    useState,
    useCallback,
    forwardRef,
    useImperativeHandle,
    useEffect,
} from 'react'
import {
    TextField,
    Select,
    MenuItem,
    Box,
    FormHelperText,
    InputLabel,
    FormControl,
    OutlinedInput,
    Grid,
    useMediaQuery,
    styled,
} from '@mui/material'
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material'
import { countries } from 'countries-list'

interface CountryOption {
    code: string
    name: string
    phone: string
}

const countryOptions: CountryOption[] = Object.entries(countries).map(
    ([code, country]) => ({
        code,
        name: country.name,
        phone: country.phone[0].toString(),
    }),
)

interface PhoneNumberFieldProps {
    error?: boolean
    helperText?: string
    name?: string
    label?: string
    onPhoneNumberChange?: (phoneNumber: string) => void
    onPhonePrefixChange?: (prefix: string) => void
    onPhoneCountryChange?: (country: string) => void
    value?: string
    specificCountry?: string
}

const PhoneNumberField = forwardRef(function PhoneNumberField(
    {
        error = false,
        helperText = '',
        name = 'phoneNumber',
        label = 'Phone',
        onPhonePrefixChange,
        onPhoneNumberChange,
        onPhoneCountryChange,
        value,
        specificCountry,
    }: PhoneNumberFieldProps,
    ref,
) {
    const defaultCountryOption =
        countryOptions.find((country) => country.code === 'TH') ||
        countryOptions[0]

    const [selectedCountry, setSelectedCountry] =
        useState<CountryOption>(defaultCountryOption)
    const [phoneNumber, setPhoneNumber] = useState('')
    const isSmallScreen = useMediaQuery((theme: any) =>
        theme.breakpoints.down('sm'),
    )

    useEffect(() => {
        if (
            defaultCountryOption &&
            onPhonePrefixChange &&
            onPhoneCountryChange
        ) {
            onPhonePrefixChange(`+${defaultCountryOption.phone}`)
            onPhoneCountryChange(defaultCountryOption.code)
        }
    }, [])

    useEffect(() => {
        const countryOption = countryOptions.find(
            (country) => country.code === specificCountry,
        )
        if (countryOption && Object.keys(countryOption).length > 0) {
            setSelectedCountry(countryOption)
        }
    }, [specificCountry])

    const handleCountryChange = useCallback(
        (event: any) => {
            const country = countryOptions.find(
                (c) => c.code === event.target.value,
            )
            if (country) {
                setSelectedCountry(country)
                if (onPhonePrefixChange)
                    onPhonePrefixChange(`+${country.phone}`)
                if (onPhoneCountryChange) onPhoneCountryChange(country.code)
            }
        },
        [onPhonePrefixChange, onPhoneCountryChange],
    )

    const handlePhoneNumberChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setPhoneNumber(event.target.value)
            if (onPhoneNumberChange) onPhoneNumberChange(event.target.value)
        },
        [onPhoneNumberChange],
    )

    useImperativeHandle(ref, () => ({
        resetPhoneNumber: () => {
            setPhoneNumber('')
        },
    }))

    const commonInputStyles = {
        height: '56px',
        '& .MuiOutlinedInput-notchedOutline': {
            borderRightWidth: 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
        '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            height: '100%',
        },
    }

    const CountryCodeSelect = styled(Select)({
        '& .MuiSelect-icon': {
            display: !isSmallScreen ? 'block' : 'none',
        },
    })

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Grid container spacing={1}>
                <Grid item xs={4} sm={3} sx={{ pr: 0, mr: '-8px' }}>
                    <FormControl fullWidth>
                        <InputLabel
                            htmlFor="select-input"
                            id="phone-number-label"
                            shrink
                        >
                            {label}
                        </InputLabel>
                        <CountryCodeSelect
                            name="phoneCountryCode"
                            value={selectedCountry.code}
                            onChange={handleCountryChange}
                            sx={commonInputStyles}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                        maxWidth: 270,
                                        marginLeft: '40px',
                                    },
                                },
                            }}
                            IconComponent={
                                !isSmallScreen
                                    ? KeyboardArrowDownIcon
                                    : undefined
                            }
                            renderValue={(value) => {
                                const country = countryOptions.find(
                                    (c) => c.code === value,
                                )
                                return (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <img
                                            loading="lazy"
                                            width="20"
                                            height="15"
                                            src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country?.code.toUpperCase()}.svg`}
                                            alt=""
                                            style={{
                                                marginRight: 8,
                                                display: `${isSmallScreen ? 'none' : 'block'}`,
                                            }}
                                        />
                                        +{country?.phone}
                                    </Box>
                                )
                            }}
                            input={
                                <OutlinedInput
                                    notched
                                    label={label}
                                    id="select-input"
                                />
                            }
                        >
                            {countryOptions.map((option) => (
                                <MenuItem key={option.code} value={option.code}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <img
                                            loading="lazy"
                                            width="20"
                                            height="15"
                                            src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${option.code.toUpperCase()}.svg`}
                                            alt=""
                                            style={{ marginRight: 8 }}
                                        />
                                        +{option.phone} {option.name}
                                    </Box>
                                </MenuItem>
                            ))}
                        </CountryCodeSelect>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={9}>
                    <TextField
                        name={name}
                        variant="outlined"
                        value={value ?? phoneNumber}
                        onChange={handlePhoneNumberChange}
                        placeholder="Enter your phone number"
                        error={error}
                        fullWidth
                        sx={{
                            ...commonInputStyles,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderRightWidth: 1,
                            },
                            '& .MuiOutlinedInput-root': {
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                height: '100%',
                            },
                        }}
                    />
                </Grid>
            </Grid>
            <TextField
                type="hidden"
                label="Phone prefix"
                name="phonePrefix"
                value={`+${selectedCountry.phone}`}
                sx={{ display: 'none' }}
            />
            {helperText && (
                <FormHelperText error={error}>{helperText}</FormHelperText>
            )}
        </Box>
    )
})

export default PhoneNumberField
