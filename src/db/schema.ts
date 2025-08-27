import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const companiesTable = pgTable('companies', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  company_name: varchar({ length: 255 }),
  employee_size: varchar({ length: 63 }),
  country: varchar({ length: 127 }),
  city: varchar({ length: 255 }),
  domain: varchar({ length: 255 }),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
