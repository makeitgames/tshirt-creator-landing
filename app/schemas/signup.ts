import { z } from 'zod'
// import { FirebaseService } from '~/services/FirebaseService'

const defaultNameCharacterLimit: number = 100

const SignupSchema: z.ZodType = z
    .object({
        // username: z
        //     .string({
        //         invalid_type_error: 'username must be a string',
        //     })
        //     .min(1, 'Please fill this in')
        //     .max(
        //         defaultNameCharacterLimit,
        //         `username must be at most ${defaultNameCharacterLimit} characters long`,
        //     ),
        fullName: z
            .string({
                invalid_type_error: 'Full Name must be a string',
            })
            .min(1, 'Please fill this in')
            .max(
                defaultNameCharacterLimit,
                `Full Name must be at most ${defaultNameCharacterLimit} characters long`,
            ),
        email: z
            .string({
                invalid_type_error: 'email must be a string',
            })
            .min(1, 'Please fill this in')
            .email('Please enter a valid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .refine((value) => {
                // Check for character types
                const hasLowerCase = /[a-z]/.test(value)
                const hasUpperCase = /[A-Z]/.test(value)
                const hasNumber = /\d/.test(value)
                const hasSpecialChar = /[!@#$%&]/.test(value)

                // Count how many character types are present
                const charTypes = [
                    hasLowerCase,
                    hasUpperCase,
                    hasNumber,
                    hasSpecialChar,
                ].filter(Boolean).length
                return charTypes >= 3
            }, 'Your password needs to be at least 8 characters including at least 3 of the following 4 types of characters: a lower case letter, an uppercase letter, a number, a special character (such as !@#$%&)'),
        confirmPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .refine((value) => {
                // Check for character types
                const hasLowerCase = /[a-z]/.test(value)
                const hasUpperCase = /[A-Z]/.test(value)
                const hasNumber = /\d/.test(value)
                const hasSpecialChar = /[!@#$%&]/.test(value)

                // Count how many character types are present
                const charTypes = [
                    hasLowerCase,
                    hasUpperCase,
                    hasNumber,
                    hasSpecialChar,
                ].filter(Boolean).length
                return charTypes >= 3
            }, 'Your password needs to be at least 8 characters including at least 3 of the following 4 types of characters: a lower case letter, an uppercase letter, a number, a special character (such as !@#$%&)'),
        promotionSubscibe: z.string().default('off'),
    })
    .superRefine(async (data, ctx) => {
        // await FirebaseService.ensureInitialized()
        // const userCount = await FirebaseService.countDocuments('user-profile', {
        //     username: data.username,
        // })

        // if (userCount > 0) {
        //     ctx.addIssue({
        //         code: 'custom',
        //         path: ['username'],
        //         message: 'This username already exists',
        //     })
        // }
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: 'custom',
                path: ['confirmPassword'],
                message:
                    "Your passwords don't match. Check, re-enter and try again.",
            })
        }
    })

export { SignupSchema }
