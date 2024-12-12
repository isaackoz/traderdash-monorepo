import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '@core/common/database/database.module';
import { ExchangeModule } from './exchange/exchange.module';
import { TradesModule } from './trades/trades.module';

@Module({
  imports: [DatabaseModule, ExchangeModule, TradesModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
