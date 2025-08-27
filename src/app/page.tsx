'use client';

import { useEffect, useState } from 'react';
import { CompaniesTable } from '@/components/CompaniesTable';
import { CsvUploadCard } from '@/components/CsvUploadCard';
import { Company } from '@/types';
import { getCompanies } from '@/api-client/companies';

export default function Home() {
  // ENHANCEMENT - use context
  const [companies, setCompanies] = useState<Company[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ENHANCEMENT - Implement debouncing for the domain filter
  const [domain, setDomain] = useState('');
  const [country, setCountry] = useState('');
  const [employeeSize, setEmployeeSize] = useState('');

  // ENHANCEMENT - Implement fetching pagination
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await getCompanies({
          domain,
          country,
          employeeSize,
        });
        if (!hasLoaded) {
          setAllCompanies(response.companies);
        }
        setCompanies(response.companies);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load companies'
        );
      } finally {
        setLoading(false);
        setHasLoaded(true);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, country, employeeSize]);

  const handleUploadSuccess = (newCompanies: Company[]) => {
    setCompanies((prev) => [...prev, ...newCompanies]);
    setAllCompanies((prev) => [...prev, ...newCompanies]);
  };

  // ENHANCEMENT - Store everything in a single state
  const handleFilterChange = (
    filterType: 'domain' | 'country' | 'employeeSize',
    value: string
  ) => {
    if (filterType === 'domain') {
      setDomain(value);
    } else if (filterType === 'country') {
      setCountry(value);
    } else if (filterType === 'employeeSize') {
      setEmployeeSize(value);
    }
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
            domain={domain}
            country={country}
            employeeSize={employeeSize}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  );
}
