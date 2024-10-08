import { z } from 'zod'

const BrandInfoSchema = z.object({
    brandName: z
        .string({
            invalid_type_error: 'Brand name must be a string',
        })
        .min(1, 'Please fill this in'),
    agreeToTermsAndPolicies: z
        .boolean({
            invalid_type_error: 'You must agree to the terms and policies',
        })
        .refine((value) => value === true, {
            message: 'You must agree to the terms and policies',
        }),
})

export { BrandInfoSchema }
