import { GetCompaniesResponseSchema, GetCompaniesResponse } from './schemas';

export async function getCompanies(): Promise<GetCompaniesResponse> {
  const response = await fetch('/api/companies');

  if (!response.ok) {
    throw new Error(`Failed to fetch companies: ${response.statusText}`);
  }

  const data = await response.json();

  return GetCompaniesResponseSchema.parse(data);
}
