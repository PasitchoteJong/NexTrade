import { z } from "zod";
import bcrypt from "bcryptjs";

const mobileRegex = /^[0-9]{10,15}$/

export const registerSchema = z.object({
    email: z.string()
        .trim()
        .min(2, "email require")
        .email("Must be valid email"),
    firstName: z.string()
        .trim()
        .min(2, "firstname is required"),
    lastName: z.string()
        .trim()
        .min(2, "lastname is required"),
    mobile: z.string()
        .trim()
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
});

export const loginSchema = z.object({
    email: z.string()
        .min(2, "email require")
        .email("Must be valid email"),
    password: z.string()
        .min(8, "password at least 8 characters")
}).transform(data => ({
    email: data.email,
    password: data.password
})
);

export const walletSchema = z.object({
    amount: z.number()
        .min(1000, "Invalid deposit amount")
        .max(1000000, "Invalid deposit amount"),
    bookbankId: z.string()
        .trim()
        .length(10, "BookbankID invalid must 10 characters")
        .regex(/^\d+$/, "Bookbank ID must contain only numbers"),
    bankName: z
        .enum(["SCB","KBANK","KTB","BBL","TTB"], "Invalid BankName")
}).transform(data => ({
    amount: data.amount,
    bookbankId: data.bookbankId,
    bankName: data.bankName
}));


export const stockSchema = z.object({
    symbol: z.string()
        .trim()
        .min(1, "Symbol is required"),
    companyName: z.string()
        .trim()
        .min(1, "CompanyName is required"),
    exchange: z.string()
        .trim()
        .min(1, "Exchange is required"),
    currency: z.string()
        .trim()
        .min(1, "Currency is required"),
    logo: z.string()
        .trim()
        .optional(),
    industry: z.string()
        .trim()
        .optional()
}).transform(data => ({
    symbol: data.symbol.toUpperCase(),
    companyName: data.companyName,
    currency: data.currency,
    exchange: data.exchange.toUpperCase(),
    logo: data.logo,
    industry: data.industry
}));

export const stockIdSchema = z.object({
    id: z.string()
        .trim()
        .min(1, "Stock is required")
        .uuid("Invalid stock id")
})

export const stockSearchSchema = z.object({
    search: z
        .string()
        .min(1)
        .max(20)
        .optional()
});

export const stockUpdateSchema = z.object({
    companyName: z.string()
        .trim()
        .min(1, "CompanyName is required")
        .optional(),
    exchange: z.string()
        .trim()
        .min(1, "Exchange is required")
        .optional()
        .transform(value => value.toUpperCase()),
    currency: z.string()
        .trim()
        .min(1, "Currency is required"),
    logo: z.string()
        .trim()
        .optional(),
    industry: z.string()
        .trim()
        .optional()
});

export const updateStockStatusSchema = z.object({
    isActive: z.boolean()
});

export const symbolSchema = z.object({
    symbol: z.string()
        .trim()
        .min(1, "Symbol is required")
})

export const tradeSchema = z.object({
    symbol: z.string()
        .trim()
        .min(1, "Symbol is required")
        .max(10, 'Symbol cannot have many character')
        .transform(value => value.toUpperCase()),
    quantity: z.number()
        .min(1,"Quantity is required")
})