import { Inject } from '@nestjs/common';
import { PG_CONNECTION } from '../drizzle/pg-connection';
import type * as EntitiesSchema from '@repo/db';
import { ConfigService } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
/**
 * A base dao that simply returns the db object
 */
export class BaseDao {
  constructor(
    @Inject(PG_CONNECTION)
    protected readonly db: NodePgDatabase<typeof EntitiesSchema>,
    @Inject(ConfigService)
    protected readonly configService: ConfigService,
  ) {}

  getDb(): NodePgDatabase<typeof EntitiesSchema> {
    return this.db;
  }
}
