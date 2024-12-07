import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { UserDao } from './entities/user/user.dao';
import { ExchangeDao } from './entities/user/exchange.dao';

const DAOs = [UserDao, ExchangeDao];

@Module({
  providers: [...DAOs],
  imports: [DrizzleModule],
  exports: DAOs,
})
export class DatabaseModule {}
