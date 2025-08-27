import {
  GetCompaniesResponseSchema,
  GetCompaniesResponse,
  UploadCsvResponseSchema,
  UploadCsvResponse,
} from './schemas';

export async function getCompanies(): Promise<GetCompaniesResponse> {
  const response = await fetch('/api/companies');

  if (!response.ok) {
    throw new Error(`Failed to fetch companies: ${response.statusText}`);
  }

  const data = await response.json();

  return GetCompaniesResponseSchema.parse(data);
}

export async function uploadCsv(file: File): Promise<UploadCsvResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload-csv', {
    method: 'POST',
    body: formData,
  });

  return UploadCsvResponseSchema.parse(await response.json());
}
