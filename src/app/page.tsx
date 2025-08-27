'use client';

import { useEffect, useState } from 'react';
import { CompaniesTable } from '@/components/CompaniesTable';
import { CsvUploadCard } from '@/components/CsvUploadCard';
import { Company } from '@/types';
import { deleteCompanies, getCompanies } from '@/api-client/companies';

export default function Home() {
  // ENHANCEMENT - use context
  const [companies, setCompanies] = useState<Company[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ENHANCEMENT - Implement debouncing for the domain filter
  const [filters, setFilters] = useState<{
    domain: string;
    country: string;
    employeeSize: string;
  }>({
    domain: '',
    country: '',
    employeeSize: '',
  });

  // ENHANCEMENT - Implement fetching pagination
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await getCompanies(filters);
        if (!hasLoaded) {
          setAllCompanies(response.companies);
        }
        // ENHANCEMENT - Add a toast
        setCompanies(response.companies);
      } catch {
        setError('Failed to load companies');
      } finally {
        setLoading(false);
        setHasLoaded(true);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleUploadSuccess = (newCompanies: Company[]) => {
    setCompanies((prev) => [...prev, ...newCompanies]);
    setAllCompanies((prev) => [...prev, ...newCompanies]);
  };

  // ENHANCEMENT - Store everything in a single state
  const handleFilterChange = (
    filterType: 'domain' | 'country' | 'employeeSize',
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleDeleteCompanies = async () => {
    await deleteCompanies();
    setCompanies([]);
    setAllCompanies([]);
    setFilters({
      domain: '',
      country: '',
      employeeSize: '',
    });
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
            allCompanies={allCompanies}
            companies={companies}
            loadingInitial={loading && !hasLoaded}
            loadingFilters={loading}
            error={error}
            filters={filters}
            onFilterChange={handleFilterChange}
            onDeleteCompanies={handleDeleteCompanies}
          />
        </div>
      </div>
    </div>
  );
}
