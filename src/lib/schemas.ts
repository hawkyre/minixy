import { z } from 'zod';

export const CompanySchema = z.object({
  id: z.number(),
  company_name: z.string().nullable(),
  employee_size: z.string().nullable(),
  country: z.string().nullable(),
  city: z.string().nullable(),
  domain: z.string().nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export type Company = z.infer<typeof CompanySchema>;
