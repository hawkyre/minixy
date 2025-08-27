'use client';

import { useEffect, useState } from 'react';
import { CompaniesTable } from '@/components/CompaniesTable';
import { CsvUploadCard } from '@/components/CsvUploadCard';
import { Company } from '@/types';
import { getCompanies } from '@/api-client/companies';

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ENHANCEMENT - Implement fetching pagination
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await getCompanies();
        setCompanies(response.companies);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load companies'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleUploadSuccess = (newCompanies: Company[]) => {
    setCompanies((prev) => [...prev, ...newCompanies]);
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold tracking-tight mb-2'>
            Company Directory
          </h1>
          <p className='text-muted-foreground text-lg'>
            Browse and search through our company database
          </p>
        </div>

        <div className='space-y-6'>
          <CsvUploadCard onUploadSuccess={handleUploadSuccess} />
          <CompaniesTable
            companies={companies}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
