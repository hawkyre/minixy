import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { companiesTable } from '@/db/schema';
import { eq, ilike, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domainFilter = searchParams.get('domain');
  const countryFilter = searchParams.get('country');
  const employeeSizeFilter = searchParams.get('employeeSize');

  try {
    const db = drizzle(process.env.DATABASE_URL!);

    const companies = await db
      .select()
      .from(companiesTable)
      .where(
        and(
          domainFilter
            ? ilike(companiesTable.domain, `%${domainFilter}%`)
            : undefined,
          countryFilter ? eq(companiesTable.country, countryFilter) : undefined,
          employeeSizeFilter
            ? eq(companiesTable.employee_size, employeeSizeFilter)
            : undefined
        )
      );

    return NextResponse.json({ companies }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving companies:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve companies' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const db = drizzle(process.env.DATABASE_URL!);
  await db.delete(companiesTable);
  return NextResponse.json({ message: 'Companies deleted' }, { status: 200 });
}
