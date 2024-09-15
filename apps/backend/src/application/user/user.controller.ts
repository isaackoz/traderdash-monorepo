import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@app/auth/auth.guard';
import { Session } from '@app/auth/session/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { TAPIUserMeGet } from '@repo/shared-types';
import UserRoles from 'supertokens-node/recipe/userroles';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(new AuthGuard())
  @Get('me')
  async getMe(@Session() session: SessionContainer): Promise<TAPIUserMeGet> {
    return this.userService.getMe(session.getUserId());
  }

  @UseGuards(new AuthGuard())
  @Get('me/test')
  async getMeTest(
    @Session() session: SessionContainer,
  ): Promise<TAPIUserMeGet> {
    const permissions = (
      await session.getClaimValue(UserRoles.PermissionClaim)
    )?.includes('test:page');
    if (!permissions) {
      throw new HttpException(
        { message: 'You have insufficient permissions' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.userService.getMe(session.getUserId());
  }
}
