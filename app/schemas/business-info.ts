import { z } from 'zod'

const BusinessInfoSchema = z.object({
    taxCountry: z
        .string({
            invalid_type_error: 'Tax country must be a string',
        })
        .min(1, 'Please fill this in'),
    businessName: z
        .string({
            invalid_type_error: 'Business name must be a string',
        })
        .min(1, 'Please fill this in'),
    organizationNumber: z
        .string({
            invalid_type_error: 'Business name must be a string',
        })
        .optional(),
    proofOfBusiness: z
        .instanceof(File, {
            message: 'Proof of business must be a file',
        })
        .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: 'File size must be less than 10MB',
        })
        .refine((file) => file.type === 'application/pdf', {
            message: 'Proof of business must be a PDF file',
        })
        .optional(),
})

export { BusinessInfoSchema }
