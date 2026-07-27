const { z } = require("zod");

const passwordRules = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");
const emailRules = z.string().trim().email("Invalid email address");

const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name cannot exceed 50 characters"),

    email: emailRules,

    password: passwordRules,

    role: z.enum(["citizen", "tourist", "staff", "admin"]).optional(),

    adminSecretKey: z.string().optional()
});

const loginSchema = z.object({
    email: emailRules,

    password: z
        .string()
        .min(1, "Password is required")
});

const verifyEmailSchema = z.object({
    email: emailRules,

    otp: z
        .string()
        .length(6, "OTP must be 6 digits")
});

const forgotPasswordSchema = z.object({
    email: emailRules
});

const resetPasswordSchema = z.object({
    email: emailRules,


    otp: z
        .string()
        .length(6, "OTP must be 6 digits"),

    newPassword: passwordRules
});

const changePasswordSchema = z.object({
    oldPassword: z
        .string()
        .min(1, "Old password is required"),

    newPassword: passwordRules
});

const resendOTPSchema = z.object({
    email: emailRules,
    purpose: z.enum(["verify-email", "reset-password"], {
        errorMap: () => ({ message: "Invalid OTP purpose" })
    })
});

const adminCreateUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name cannot exceed 50 characters"),
    email: emailRules,
    password: passwordRules,
    role: z.enum(["citizen", "tourist", "staff", "admin"])
});

module.exports = {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    resendOTPSchema,
    adminCreateUserSchema
};