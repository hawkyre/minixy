'use client';

import { useState, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { Search, Loader2 } from 'lucide-react';
import { Company } from '@/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CompaniesTableProps {
  companies: Company[];
  allCompanies: Company[];
  loadingInitial: boolean;
  loadingFilters: boolean;
  error: string | null;
  domain: string;
  country: string;
  employeeSize: string;
  onFilterChange: (
    filterType: 'domain' | 'country' | 'employeeSize',
    value: string
  ) => void;
}

export function CompaniesTable({
  companies,
  allCompanies,
  loadingInitial,
  loadingFilters,
  error,
  domain,
  country,
  employeeSize,
  onFilterChange,
}: CompaniesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Get unique countries for the filter dropdown
  const uniqueCountries = useMemo(() => {
    const countries = allCompanies
      .map((company) => company.country)
      .filter((country): country is string => Boolean(country))
      .sort();
    return Array.from(new Set(countries));
  }, [allCompanies]);

  const uniqueEmployeeSizes = useMemo(() => {
    const employeeSizes = allCompanies
      .map((company) => company.employee_size)
      .filter((employeeSize): employeeSize is string => Boolean(employeeSize))
      .sort();
    return Array.from(new Set(employeeSizes));
  }, [allCompanies]);

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const columns = useMemo<ColumnDef<Company>[]>(
    () => [
      {
        accessorKey: 'company_name',
        header: 'Company Name',
      },
      {
        accessorKey: 'employee_size',
        header: 'Employee Size',
      },
      {
        accessorKey: 'country',
        header: 'Country',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'domain',
        header: 'Domain',
        cell: ({ row }) => {
          const domain = row.getValue('domain') as string;
          return domain ? (
            <a
              href={`https://${domain}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 hover:underline'
            >
              {domain}
            </a>
          ) : null;
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Added at',
        cell: ({ row }) => (
          <div className='text-sm text-muted-foreground'>
            {formatDateTime(row.getValue('created_at'))}
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: companies,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  if (loadingInitial) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center p-12'>
          <div className='flex items-center space-x-2'>
            <Loader2 className='h-6 w-6 animate-spin' />
            <span>Loading companies...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center p-12'>
          <div className='text-center'>
            <p className='text-destructive mb-2'>Error loading companies</p>
            <p className='text-sm text-muted-foreground'>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <CardTitle>Companies Directory</CardTitle>
              <CardDescription>
                {companies.length} companies in the database
              </CardDescription>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex flex-wrap gap-4'>
              <div className='flex flex-col space-y-1'>
                <label className='text-sm font-medium text-muted-foreground'>
                  Country
                </label>
                <Select
                  value={country}
                  onValueChange={(value) => onFilterChange('country', value)}
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='All countries' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='_'>All countries</SelectItem>
                    {uniqueCountries.map((countryOption) => (
                      <SelectItem key={countryOption} value={countryOption}>
                        {countryOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col space-y-1'>
                <label className='text-sm font-medium text-muted-foreground'>
                  Employee Size
                </label>
                <Select
                  value={employeeSize}
                  onValueChange={(value) =>
                    onFilterChange('employeeSize', value)
                  }
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='All sizes' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='_'>All sizes</SelectItem>
                    {uniqueEmployeeSizes.map((sizeOption) => (
                      <SelectItem key={sizeOption} value={sizeOption}>
                        {sizeOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col space-y-1'>
                <label className='text-sm font-medium text-muted-foreground'>
                  Domain
                </label>
                <div className='relative w-64'>
                  <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    placeholder='Search by domain...'
                    value={domain}
                    onChange={(e) => onFilterChange('domain', e.target.value)}
                    className='pl-9'
                  />
                </div>
              </div>
            </div>
            {loadingFilters && (
              <div className='flex items-center justify-center'>
                <Loader2 className='h-6 w-6 animate-spin' />
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='rounded-md border max-h-[600px] overflow-y-auto'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No companies found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {companies.length > 0 && (
          <div className='flex items-center justify-end space-x-2 py-4'>
            <div className='text-sm text-muted-foreground'>
              Showing {table.getFilteredRowModel().rows.length} of{' '}
              {companies.length} companies
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
