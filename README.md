# Minixy

This is a [Next.js](https://nextjs.org) React application with PostgreSQL database, containerized with Docker.

## Getting Started

### Using Docker (Recommended)

1. Start the application and database:

```bash
docker-compose up
```

This will start:
- Next.js React app on [http://localhost:3000](http://localhost:3000)
- PostgreSQL database on port 5432

2. The app will automatically reload when you make changes to the code.

### Development without Docker

1. Install dependencies:

```bash
npm install
```

2. Start a PostgreSQL database (you'll need to set up your own)

3. Set the DATABASE_URL environment variable:

```bash
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/minixy_dev
```

4. Run the development server:

```bash
npm run dev
```

## Database Connection

The app includes a PostgreSQL connection utility at `src/lib/db.ts` that you can use to query the database. The connection string is automatically configured when using Docker Compose.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
