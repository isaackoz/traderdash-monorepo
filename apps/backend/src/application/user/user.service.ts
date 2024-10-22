import { UserDao } from '@core/common/database/entities/user/user.dao';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  TAPICompleteOnboardingPOST,
  TAPIUserCheckUsernamePOST,
} from '@repo/shared-types';

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

  async completeOnboarding(
    id: string,
    username: string,
  ): Promise<TAPICompleteOnboardingPOST> {
    try {
      // Check if onboarding is complete or not
      const isOnboardingComplete = await this.userDao.isOnboardedComplete(id);
      if (isOnboardingComplete) {
        throw new HttpException(
          {
            message: 'Onboarding already completed',
            errors: [{}],
          },
          HttpStatus.FORBIDDEN,
        );
      }
      // Check username is available
      const isAvailable = await this.userDao.checkUsernameAvailable(username);
      if (!isAvailable) {
        return {
          success: false,
          message: 'Username is not available',
        };
      }

      await this.userDao.completeOnboarding(id, username);
      return {
        success: true,
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
