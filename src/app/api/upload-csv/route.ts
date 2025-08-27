import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();

    // Get the CSV file from the form data
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check if the file is a CSV
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      return NextResponse.json(
        { error: 'File must be a CSV' },
        { status: 400 }
      );
    }

    // Read the file content as text
    const csvText = await file.text();

    // Parse the CSV using papaparse
    const parseResult = Papa.parse(csvText, {
      header: true, // Use first row as headers
      skipEmptyLines: true,
    });

    // Print each row to console
    console.log('CSV Upload - File:', file.name);
    console.log('CSV Upload - Total rows:', parseResult.data.length);
    console.log('CSV Upload - Headers:', parseResult.meta.fields);
    console.log('CSV Upload - Rows:');

    parseResult.data.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);
    });

    // Check for parsing errors
    if (parseResult.errors.length > 0) {
      console.log('CSV Upload - Parsing errors:', parseResult.errors);
    }

    return NextResponse.json(
      {
        message: 'CSV uploaded and processed successfully',
        rowCount: parseResult.data.length,
        headers: parseResult.meta.fields,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing CSV upload:', error);
    return NextResponse.json(
      { error: 'Failed to process CSV file' },
      { status: 500 }
    );
  }
}
