import { DatabaseModule } from '@core/common/database/database.module';
import { Module } from '@nestjs/common';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TradesController],
  providers: [TradesService],
})
export class TradesModule {}
