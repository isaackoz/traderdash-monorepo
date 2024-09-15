import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PG_CONNECTION } from './pg-connection';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as EntitiesSchema from '../entities/entities.schema';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PG_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        try {
          const pool = new Pool({
            connectionString: configService.get<string>('DB_URL'),
          });
          await pool.query('SELECT 1');
          return drizzle(pool, { schema: EntitiesSchema });
        } catch {
          console.log('DB Connection error');
          throw new HttpException(
            'Database service down',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }
      },
    },
  ],
  exports: [PG_CONNECTION],
})
export class DrizzleModule {}
