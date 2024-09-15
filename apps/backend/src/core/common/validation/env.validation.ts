import { z } from 'zod';

const envConfigSchema = z.object({
  DB_USER: z.coerce.string().min(1),
  DB_PASSWORD: z.coerce.string().min(1),
  DB_HOST_NAME: z.coerce.string().min(1),
  DB_PORT: z.coerce.string().min(1),
  // Name of the database
  DB_NAME: z.coerce.string().min(1),
  // Name of the schema to use
  DB_SCHEMA_NAME: z.coerce.string().min(1),
  DB_URL: z.coerce.string().min(1),
});

export function validate(config: Record<string, unknown>) {
  const validatedConfig = envConfigSchema.parse(config);
  return validatedConfig;
}
