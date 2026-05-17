import { z } from 'zod';
import { LeadStatus, LeadSource } from '../../shared/types/lead.types';
import { UserRole } from '../../shared/types/auth.types';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
  role: z.nativeEnum(UserRole).optional().default(UserRole.SALES),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().min(1, 'Company is required').max(200),
  status: z.nativeEnum(LeadStatus).optional().default(LeadStatus.NEW),
  source: z.nativeEnum(LeadSource, { errorMap: () => ({ message: 'Invalid lead source' }) }),
  value: z.number().min(0, 'Value cannot be negative').optional().default(0),
  notes: z.string().max(2000).optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const leadFiltersSchema = z.object({
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type CreateLeadDTO = z.infer<typeof createLeadSchema>;
export type UpdateLeadDTO = z.infer<typeof updateLeadSchema>;
export type LeadFiltersDTO = z.infer<typeof leadFiltersSchema>;
