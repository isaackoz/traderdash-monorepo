import { TradesDao } from '@core/common/database/entities/user/trades.dao';
// import { UserDao } from '@core/common/database/entities/user/user.dao';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddTradeToDbData } from '@repo/shared-schemas';
import { TAPIUserTradesGet } from '@repo/shared-types';

@Injectable()
export class TradesService {
  constructor(private readonly tradesDao: TradesDao) {}

  async addNewTrade(userId: string, data: AddTradeToDbData) {
    try {
      return await this.tradesDao.addNewTrade(userId, data);
    } catch (e: unknown) {
      console.error(e);
      throw new HttpException(
        { message: 'An unknown server error occured' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getTrades(userId: string): Promise<TAPIUserTradesGet[]> {
    try {
      return await this.tradesDao.getTrades(userId);
    } catch (e: unknown) {
      console.error(e);
      throw new HttpException(
        { message: 'An unknown server error occured' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
