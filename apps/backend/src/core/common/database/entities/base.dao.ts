import { Inject } from '@nestjs/common';
import { PG_CONNECTION } from '../drizzle/pg-connection';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type * as EntitiesSchema from '@repo/db';
/**
 * A base dao that simply returns the db object
 */
export class BaseDao {
  constructor(
    @Inject(PG_CONNECTION)
    protected readonly db: PostgresJsDatabase<typeof EntitiesSchema>,
  ) {}

  getDb(): PostgresJsDatabase<typeof EntitiesSchema> {
    return this.db;
  }
}
