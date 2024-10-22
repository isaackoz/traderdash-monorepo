import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@app/auth/auth.guard';
import { Session } from '@app/auth/session/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import {
  TAPICompleteOnboardingPOST,
  TAPIUserCheckUsernamePOST,
  TAPIUserMeGet,
} from '@repo/shared-types';
import UserRoles from 'supertokens-node/recipe/userroles';
import { ParseStringPipe } from '@core/common/validation/parse-string.pipe';

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

  @UseGuards(new AuthGuard())
  @Post('check-username')
  async checkUsername(
    @Query('username', new ParseStringPipe(3)) username: string,
  ): Promise<TAPIUserCheckUsernamePOST> {
    return this.userService.checkUsername(username);
  }
  @UseGuards(new AuthGuard())
  @Post('complete-onboarding')
  async completeOnboarding(
    @Body('username', new ParseStringPipe(3)) username: string,
    @Session() session: SessionContainer,
  ): Promise<TAPICompleteOnboardingPOST> {
    return this.userService.completeOnboarding(session.getUserId(), username);
  }
}
