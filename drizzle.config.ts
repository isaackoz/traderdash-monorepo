import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./packages/db/src/index.ts",
  out: "./migrations",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
});
