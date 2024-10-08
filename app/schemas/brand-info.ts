import { z } from 'zod'

const BrandInfoSchema = z.object({
    brandName: z
        .string({
            invalid_type_error: 'Brand name must be a string',
        })
        .min(1, 'Please fill this in')
        .max(100, 'Brand name must be at most 100 characters long'),
    agreeToTermsAndPolicies: z
        .boolean({
            invalid_type_error:
                'You must accept the terms of service to continue.',
        })
        .refine((value) => value === true, {
            message: 'You must accept the terms of service to continue.',
        }),
})

export { BrandInfoSchema }
