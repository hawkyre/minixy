import {
  GetCompaniesResponseSchema,
  GetCompaniesResponse,
  UploadCsvResponseSchema,
  UploadCsvResponse,
} from './schemas';

interface GetCompaniesParams {
  domain?: string;
  country?: string;
  employeeSize?: string;
}

export async function getCompanies(
  params?: GetCompaniesParams
): Promise<GetCompaniesResponse> {
  const searchParams = new URLSearchParams();

  if (params?.domain) {
    searchParams.append('domain', params.domain);
  }
  if (params?.country && params.country !== '_') {
    searchParams.append('country', params.country);
  }
  if (params?.employeeSize && params.employeeSize !== '_') {
    searchParams.append('employeeSize', params.employeeSize);
  }

  const url = searchParams.toString()
    ? `/api/companies?${searchParams.toString()}`
    : '/api/companies';
  const response = await fetch(url);

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
