import { CompaniesTable } from '@/components/companies-table';

export default function Home() {
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
        <CompaniesTable />
      </div>
    </div>
  );
}
