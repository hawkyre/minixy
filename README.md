# Minixy

A modern company directory management system built with Next.js and PostgreSQL. Upload, enrich, and search through company databases with AI-powered data enhancement.

## Features

- **CSV Upload & Processing**: Upload company data via CSV files with automatic parsing
- **AI-Powered Data Enrichment**: Automatically clean, validate, and enrich company data using OpenAI
- **Advanced Filtering**: Filter companies by domain, country, and employee size
- **Real-time Search**: Search through company names, domains, and locations

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Drizzle ORM
- **Database**: PostgreSQL
- **AI Integration**: OpenAI API for data enrichment
- **UI Components**: shadcn/ui, TanStack Table
- **DevOps**: Docker, Docker Compose

## Getting Started

### Using Docker

1. Start the database with docker compose (I wanted to also add the application but kept getting some errors and wanted to be nimble so I removed it):

```bash
docker compose up
```

This will start the Postgres database on port 5432

2. Set up environment variables:

```bash
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/minixy_dev
export OPENAI_API_KEY=your_openai_api_key_here
```

3. Run the development server:

```bash
npm run dev
```

## CSV Data Format

When uploading CSV files, ensure your data includes the following columns:

- `company_name`: Name of the company
- `domain`: Company website domain
- `country`: Country where the company is located
- `city`: City where the company is located
- `employee_size`: Employee count (will be categorized into buckets: 1-10, 11-50, 51-200, etc.)

The AI enrichment process will automatically:

- Clean and validate data formats
- Standardize country names to ISO 3166 format
- Categorize employee sizes into proper buckets
- Infer missing information where possible

## Database Schema

The application uses a simple companies table with the following structure:

```sql
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255),
  employee_size VARCHAR(63),
  country VARCHAR(127),
  city VARCHAR(255),
  domain VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API key for data enrichment
