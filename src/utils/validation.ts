import { z } from 'zod';

export const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ProfileSetupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['provider', 'receiver']),
  avatar: z.string().optional(),
});

export const BudgetSetupSchema = z.object({
  amount: z.number().min(1, 'Budget amount must be greater than 0'),
  frequency: z.enum(['weekly', 'biweekly', 'monthly']),
});

export const CategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  limit: z.number().optional(),
});

export const ReimbursementRequestSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  photo: z.instanceof(File).optional(),
});

export const PartnerInviteSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const PairingCodeSchema = z.object({
  code: z.string().min(6, 'Pairing code must be at least 6 characters'),
});

export type SignUpFormData = z.infer<typeof SignUpSchema>;
export type SignInFormData = z.infer<typeof SignInSchema>;
export type ProfileSetupData = z.infer<typeof ProfileSetupSchema>;
export type BudgetSetupData = z.infer<typeof BudgetSetupSchema>;
export type ReimbursementRequestData = z.infer<typeof ReimbursementRequestSchema>;
