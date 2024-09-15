import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST_NAME: process.env.DB_HOST_NAME,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_SCHEMA_NAME: process.env.DB_SCHEMA,
    DB_URL: process.env.DB_URL,
  };
});
