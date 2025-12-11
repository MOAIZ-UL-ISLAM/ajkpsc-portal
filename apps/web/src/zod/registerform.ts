import * as z from 'zod';


const genders = ['male', 'female', 'other'] as const;

// Validation Schema
export const registerSchema = z.object({
    full_name: z.string()
        .min(3, 'Full name must be at least 3 characters')
        .max(100, 'Full name must not exceed 100 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Full name must contain only letters and spaces'),

    email: z.string()
        .email('Invalid email address')
        .toLowerCase(),

    cnic: z.string()
        .regex(/^\d{13}$/, 'CNIC must be exactly 13 digits')
        .length(13, 'CNIC must be exactly 13 digits'),


    gender: z.enum(genders)
        .refine(val => !!val, { message: 'Please select a gender' }),

    dob: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
        .refine((date) => {
            const birthDate = new Date(date);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            return age >= 18 && age <= 120;
        }, 'You must be at least 18 years old'),

    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),

    confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password']
});

export type RegisterFormData = z.infer<typeof registerSchema>;