import { timestamp } from 'drizzle-orm/pg-core';

export const WithModificationDates = {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdateFn(() => new Date()),
};
