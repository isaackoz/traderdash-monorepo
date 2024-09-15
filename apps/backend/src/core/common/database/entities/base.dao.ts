import { Inject } from '@nestjs/common';
import { PG_CONNECTION } from '../drizzle/pg-connection';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

/**
 * A base dao that simply returns the db object
 */
export class BaseDao {
  constructor(
    @Inject(PG_CONNECTION) protected readonly db: PostgresJsDatabase,
  ) {}

  getDb(): PostgresJsDatabase {
    return this.db;
  }
}
