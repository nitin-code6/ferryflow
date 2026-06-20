import { z } from "zod";

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

    password: passwordRules
});
const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1)
});
export { loginSchema, registerSchema };
