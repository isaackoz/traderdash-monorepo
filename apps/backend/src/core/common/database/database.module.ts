import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { UserDao } from './entities/user/user.dao';
import { ConfigModule } from '@nestjs/config';

const DAOs = [UserDao];

@Module({
  providers: [...DAOs, ConfigModule],
  imports: [DrizzleModule],
  exports: DAOs,
})
export class DatabaseModule {}
