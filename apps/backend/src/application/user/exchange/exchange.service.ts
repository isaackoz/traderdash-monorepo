import { ExchangeDao } from '@core/common/database/entities/user/exchange.dao';
import { UserDao } from '@core/common/database/entities/user/user.dao';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddUserExchangeData } from '@repo/shared-schemas';

@Injectable()
export class ExchangeService {
  constructor(
    private readonly userDao: UserDao,
    private readonly exchangeDao: ExchangeDao,
  ) {}

  async addUserExchangeConnection(userId: string, data: AddUserExchangeData) {
    try {
      await this.exchangeDao.addExchange(userId, data);
    } catch (e: unknown) {
      console.error(e);
      throw new HttpException(
        { message: 'An unknown server error occured' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllUserExchangeConnections(userId: string) {
    try {
      return await this.exchangeDao.getAllConnections(userId);
    } catch (e) {
      console.error(e);
      throw new HttpException(
        { message: 'An unknown server error occured' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
