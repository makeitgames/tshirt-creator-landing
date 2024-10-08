import { z } from 'zod'
import { FirebaseService } from '~/services/FirebaseService'

const ForgotPasswordSchema: z.ZodType = z
    .object({
        email: z
            .string({
                invalid_type_error: 'email must be a string',
            })
            .email('Please enter a valid email address'),
    })
    .superRefine(async ({ email }, ctx) => {
        if (email === '') {
            ctx.addIssue({
                code: 'custom',
                path: ['email'],
                message: 'Please fill this in',
            })
        } else {
            // Check if the email is valid before proceeding with the Firebase check
            const emailValidation = z
                .string()
                .email('Please enter a valid email address')
                .safeParse(email)

            if (!emailValidation.success) {
                return // Exit if the email format is invalid
            }

            await FirebaseService.ensureInitialized()
            const userCount = await FirebaseService.countDocuments(
                'user-profile',
                {
                    email,
                },
            )

            if (userCount === 0)
                ctx.addIssue({
                    code: 'custom',
                    path: ['email'],
                    message: 'This email is not registered',
                })
        }
    })

export { ForgotPasswordSchema }
