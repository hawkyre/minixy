import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

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
    const parseResult = Papa.parse<Row>(csvText, {
      header: true, // Use first row as headers
      skipEmptyLines: true,
    });

    const enrichedData = await Promise.all(
      parseResult.data.map(cleanRow).map(enrichRow)
    );

    return NextResponse.json(
      {
        message: 'CSV uploaded and processed successfully',
        rowCount: parseResult.data.length,
        headers: parseResult.meta.fields,
        data: enrichedData,
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

interface Row {
  country?: string;
  employee_size?: string;
  city?: string;
  domain?: string;
}

function cleanRow(row: Row) {
  const country = cleanAndTrim(row.country);
  const employeeSize = cleanAndTrim(row.employee_size);
  const city = cleanAndTrim(row.city);
  const domain = cleanAndTrim(row.domain).replace(/\s+/g, '');

  return {
    country,
    employeeSize,
    city,
    domain,
  };
}

async function enrichRow(row: Row) {
  const prompt = `
  You are an expert data analyst. You are given a row of potentially incomplete or miscategorized data. You need to enrich the data.

  The fields and their supposed values are:
  - country: ${row.country} (Should be a ISO 3166 country name)
  - employee_size: ${row.employee_size} (Should be a value from the bucket (1-10, 11-50, 51-200, 201-500, 501-1000, 1001-5000, 5001-10000, 10000+). if the value is present, use that one. if not, infer it from 2025 data.)
  - city: ${row.city} (Should be a city name)
  - domain: ${row.domain} (Should be a valid domain name)

  IMPORTANT: Some fields may have carried to the next column. Be smart and logic about it if the values don't exactly make sense but they would from another column.

  You need to enrich the data. Return a JSON object with the same fields but enriched data. Make your best guess if the data is incomplete or miscategorized, but do not leave fields empty.
  `;

  const schema = z.object({
    country: z.string(),
    employee_size: z.enum([
      '1-10',
      '11-50',
      '51-200',
      '201-500',
      '501-1000',
      '1001-5000',
      '5001-10000',
      '10000+',
    ]),
    city: z.string(),
    domain: z.string(),
  });

  const response = await generateObject({
    model: openai('o3-mini'),
    prompt: prompt,
    schemaName: 'row',
    schemaDescription: 'A row of data about a company.',
    schema: schema,
  });

  console.log(response);

  return response.object;
}

function cleanAndTrim(value?: string) {
  if (!value) {
    return '';
  }

  return value.trim().replace(/\s+/g, ' ');
}
