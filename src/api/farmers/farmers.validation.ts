import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const phoneNumberSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format");

export const loginSchema = z.object({
  body: z.object({
    phoneNumber: phoneNumberSchema,
    password: z.string(),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).max(32),
    lastName: z.string().min(2).max(32),
    phoneNumber: phoneNumberSchema,
    password: passwordSchema,
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).max(32).optional(),
    lastName: z.string().min(2).max(32).optional(),
    phoneNumber: phoneNumberSchema.optional(),
  }),
});
