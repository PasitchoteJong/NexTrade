import { z } from "zod";
import bcrypt from "bcryptjs";

const mobileRegex = /^[0-9]{10,15}$/

export const registerSchema = z.object({
    email: z.string()
        .min(2, "email require")
        .email("Must be valid email"),
    firstName: z.string()
        .min(2, "firstname is required"),
    lastName: z.string()
        .min(2, "lastname is required"),
    mobile: z.string()
        .min(10, "mobile number required")
        .refine(value => mobileRegex.test(value), {
            message: "Must be valid mobile phone"
        }),

    password: z.string()
        .min(8, "password at least 8 characters")
        .regex(/[a-z]/, "must contain lowercase 1 characters")
        .regex(/[A-Z]/, "must contain uppercase 1 characters")
        .regex(/[0-9]/, "must contain number 1 characters"),
    confirmPassword: z.string()
        .min(1, "confrim password is required"),
}).refine(data => data.password === data.confirmPassword, {
    message: " confirm password not match password",
    path: ['confirmPassword']
}).transform(async data => {
    const output = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        mobile: data.mobile,
        password: await bcrypt.hash(data.password, 8)
    }
    return output
})

export const loginSchema = z.object({
    email: z.string()
        .min(2, "email require")
        .email("Must be valid email"),
    password: z.string()
        .min(8, "password at least 8 characters")
}).transform(data=>({
    email: data.email,
    password: data.password
})
)