import { z } from 'zod';

export const RegisterSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(3, "Full name must be at least 3 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

// This represents the "Schema" for your Firestore User Document
export interface UserDocument {
  uid: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
  photoURL?: string;
}
