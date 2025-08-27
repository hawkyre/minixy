import { z } from 'zod';

export const GetCompaniesResponseSchema = z.object({
  companies: z.array(
    z.object({
      id: z.number(),
      company_name: z.string().nullable(),
      employee_size: z.string().nullable(),
      country: z.string().nullable(),
      city: z.string().nullable(),
      domain: z.string().nullable(),
      created_at: z.iso.datetime(),
      updated_at: z.iso.datetime(),
    })
  ),
});

export const UploadCsvResponseSchema = z.object({
  companies: z.array(
    z.object({
      company_name: z.string().nullable(),
      employee_size: z.string().nullable(),
      country: z.string().nullable(),
      city: z.string().nullable(),
      domain: z.string().nullable(),
    })
  ),
});

export type GetCompaniesResponse = z.infer<typeof GetCompaniesResponseSchema>;
export type UploadCsvResponse = z.infer<typeof UploadCsvResponseSchema>;
