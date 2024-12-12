import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TradesService } from './trades.service';
import { AuthGuard } from '@app/auth/auth.guard';
import { ZodValidationPipe } from '@core/common/validation/zod.pipe';
import { AddTradeToDbData, addTradeToDbSchema } from '@repo/shared-schemas';
import { Session } from '@app/auth/session/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { TAPIUserTradesGet } from '@repo/shared-types';

@Controller('/user/trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @UseGuards(new AuthGuard())
  @Post()
  async addNewTrade(
    @Body(new ZodValidationPipe(addTradeToDbSchema))
    addTradeData: AddTradeToDbData,
    @Session() session: SessionContainer,
  ): Promise<string> {
    return await this.tradesService.addNewTrade(
      session.getUserId(),
      addTradeData,
    );
  }

  @UseGuards(new AuthGuard())
  @Get()
  async getTrades(
    @Session() session: SessionContainer,
  ): Promise<TAPIUserTradesGet[]> {
    return await this.tradesService.getTrades(session.getUserId());
  }
}
