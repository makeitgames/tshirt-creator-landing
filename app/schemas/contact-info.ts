import { z } from 'zod'
import { validatePhoneNumber } from '~/utils/PhoneNumberUtils'

const defaultNameCharacterLimit: number = 100

const ContactInfoSchema = z
    .object({
        firstName: z
            .string({
                invalid_type_error: 'First name must be a string',
            })
            .min(1, 'Please fill this in')
            .max(
                defaultNameCharacterLimit,
                `First Name must be at most ${defaultNameCharacterLimit} characters long`,
            ),

        lastName: z
            .string({
                invalid_type_error: 'Last name must be a string',
            })
            .min(1, 'Please fill this in')
            .max(
                defaultNameCharacterLimit,
                `Last Name must be at most ${defaultNameCharacterLimit} characters long`,
            ),
        email: z
            .string({
                invalid_type_error: 'Email must be a string',
            })
            .min(1, 'Please fill this in')
            .email('Email must be a valid email'),
        phoneNumber: z.string(),
        phonePrefix: z.string().min(1, 'Please fill this in'),
        phoneCountryCode: z.string(),
        country: z
            .string({
                invalid_type_error: 'Country must be a string',
            })
            .min(1, 'Please fill this in'),
        street: z
            .string({
                invalid_type_error: 'Street must be a string',
            })
            .min(1, 'Please fill this in'),
        streetNumber: z
            .string({
                invalid_type_error: 'Street number must be a string',
            })
            .min(1, 'Please fill this in'),
        postalCode: z
            .string({
                invalid_type_error: 'Postal code must be a string',
            })
            .min(1, 'Please fill this in'),
        city: z
            .string({
                invalid_type_error: 'City must be a string',
            })
            .min(1, 'Please fill this in'),
        invoicingEmail: z
            .string()
            .email('Invoicing email must be a valid email')
            .optional(), // Optional invoicing email
        useInvoicingEmail: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
        validatePhoneNumber(data, ctx)

        if (data.useInvoicingEmail && !data.invoicingEmail) {
            ctx.addIssue({
                path: ['invoicingEmail'],
                message: 'Please fill this in',
                code: 'custom',
            })
        }
    })

export { ContactInfoSchema }
