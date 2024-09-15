import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'postgresql', // "mysql" | "sqlite" | "postgresql"
  schema: './src/core/common/database/entities/entities.schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DB_URL!,
  },
});
