import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { AuthGuard } from '@app/auth/auth.guard';
import { Session } from '@app/auth/session/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { ZodValidationPipe } from '@core/common/validation/zod.pipe';
import {
  addUserExchangeSchema,
  type AddUserExchangeData,
} from '@repo/shared-schemas';
import { TAPIUserExchangeGet } from '@repo/shared-types';

@Controller('user/exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @UseGuards(new AuthGuard())
  @Post()
  async addConnection(
    @Body(new ZodValidationPipe(addUserExchangeSchema))
    exchangeData: AddUserExchangeData,
    @Session() session: SessionContainer,
  ): Promise<void> {
    return await this.exchangeService.addUserExchangeConnection(
      session.getUserId(),
      exchangeData,
    );
  }

  /**
   * Get all connections
   */
  @UseGuards(new AuthGuard())
  @Get()
  async getAllExchangeConnections(
    @Session() session: SessionContainer,
  ): Promise<TAPIUserExchangeGet[]> {
    return await this.exchangeService.getAllUserExchangeConnections(
      session.getUserId(),
    );
  }
}
