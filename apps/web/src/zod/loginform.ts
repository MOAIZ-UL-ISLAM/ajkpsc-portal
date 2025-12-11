import * as z from "zod";
export const loginSchema = z.object({
    cnic: z.string()
        .regex(/^\d{13}$/, 'CNIC must be exactly 13 digits')
        .length(13, 'CNIC must be exactly 13 digits'),

    password: z.string()
        .min(8, 'Password is needed')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

export type LoginFormData = z.infer<typeof loginSchema>;