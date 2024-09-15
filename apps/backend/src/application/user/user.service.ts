import { UserDao } from '@core/common/database/entities/user/user.dao';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TAPIUserCheckUsernamePOST } from '@repo/shared-types';

@Injectable()
export class UserService {
  constructor(private readonly userDao: UserDao) {}

  async getMe(id: string) {
    try {
      const user = await this.userDao.getMe(id);
      if (!user) {
        throw new Error('No user');
      }
      return user;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown server error';
      throw new HttpException(
        {
          message: msg,
          errors: [{}],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async checkUsername(username: string): Promise<TAPIUserCheckUsernamePOST> {
    try {
      const isAvaliable = await this.userDao.checkUsernameAvailable(username);
      return {
        isAvailable: isAvaliable,
      };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown server error';
      throw new HttpException(
        {
          message: msg,
          errors: [{}],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
