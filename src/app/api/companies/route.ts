import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { companiesTable } from '@/db/schema';

export async function GET() {
  try {
    const db = drizzle(process.env.DATABASE_URL!);
    const companies = await db.select().from(companiesTable);

    return NextResponse.json({ companies: companies }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving companies:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve companies' },
      { status: 500 }
    );
  }
}
