'use client';

import { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Company } from '@/types';
import { uploadCsv } from '@/api-client/companies';

interface UploadResult {
  message: string;
  rowCount: number;
  headers: string[];
}

interface CsvUploadCardProps {
  onUploadSuccess?: (newCompanies: Company[]) => void;
}

export function CsvUploadCard({ onUploadSuccess }: CsvUploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setError(null);
    setUploadResult(null);

    if (selectedFile) {
      if (
        !selectedFile.name.endsWith('.csv') &&
        selectedFile.type !== 'text/csv'
      ) {
        setError('Please select a valid CSV file');
        setFile(null);
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setError('File size must be less than 10MB');
        setFile(null);
        return;
      }
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0] || null;
    handleFileSelect(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const result = await uploadCsv(file);

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onUploadSuccess?.(
        result.companies.map((company) => ({
          ...company,
          id: Math.round(Math.random() * -10000000),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setError(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Upload className='h-5 w-5' />
          Upload CSV File
        </CardTitle>
        <CardDescription>
          Upload a CSV file to add companies to the database. The file will be
          processed and enriched automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Input
              ref={fileInputRef}
              type='file'
              accept='.csv,text/csv'
              onChange={handleFileInputChange}
              disabled={uploading}
            />
            {file && (
              <Button
                variant='outline'
                size='sm'
                onClick={resetUpload}
                disabled={uploading}
              >
                Clear
              </Button>
            )}
          </div>

          {file && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md'>
              <FileText className='h-4 w-4' />
              <span>
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className='w-full'
        >
          {uploading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              Processing CSV...
            </>
          ) : (
            <>
              <Upload className='h-4 w-4' />
              Upload CSV
            </>
          )}
        </Button>

        {uploadResult && (
          <div className='bg-green-50 border border-green-200 rounded-md p-3'>
            <div className='flex items-center gap-2 text-green-800'>
              <CheckCircle className='h-4 w-4' />
              <span className='font-medium'>
                Upload Successful - Processed {uploadResult.rowCount} companies!
              </span>
            </div>
            <p className='text-sm text-green-700 mt-1'>
              You can check them below.
            </p>
          </div>
        )}

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-md p-3'>
            <div className='flex items-center gap-2 text-red-800'>
              <AlertCircle className='h-4 w-4' />
              <span className='font-medium'>Upload Failed</span>
            </div>
            <p className='text-sm text-red-700 mt-1'>{error}</p>
          </div>
        )}

        <div className='text-xs text-muted-foreground bg-muted/30 p-2 rounded-md'>
          <p className='font-medium mb-1'>CSV Format Requirements:</p>
          <ul className='space-y-0.5 ml-2'>
            <li>
              • Must have the headers: company_name, country, employee_size,
              city, domain
            </li>
            <li>• File size must be less than 10MB</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
