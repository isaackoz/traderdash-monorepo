import { Module } from '@nestjs/common';
import { DatabaseModule } from '@core/common/database/database.module';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ExchangeController],
  providers: [ExchangeService],
})
export class ExchangeModule {}
