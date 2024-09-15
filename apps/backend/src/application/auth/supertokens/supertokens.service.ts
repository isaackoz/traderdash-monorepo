import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import Passwordless from 'supertokens-node/recipe/passwordless';
import Dashboard from 'supertokens-node/recipe/dashboard';
import UserRoles from 'supertokens-node/recipe/userroles';

import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';
import { UserDao } from '@core/common/database/entities/user/user.dao';

@Injectable()
export class SupertokensService {
  constructor(
    @Inject(ConfigInjectionToken) private config: AuthModuleConfig,
    private readonly userDao: UserDao,
  ) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        Passwordless.init({
          flowType: 'MAGIC_LINK',
          contactMethod: 'EMAIL',
          override: {
            functions: (originalImplementation) => {
              return {
                ...originalImplementation,
                consumeCode: async (input) => {
                  const response =
                    await originalImplementation.consumeCode(input);
                  if (response.status === 'OK') {
                    const { id, emails } = response.user;
                    if (input.session === undefined) {
                      // Check if the user exists in our db
                      try {
                        const doesExist =
                          await userDao.checkIfUserExistsById(id);
                        if (!doesExist) {
                          // If user does not exist, attempt to create an account for them
                          try {
                            await userDao.createNew(id, emails[0]);
                            return response;
                          } catch {
                            throw new HttpException(
                              { message: 'Could not create new user' },
                              HttpStatus.BAD_REQUEST,
                            );
                          }
                        } else {
                          // If the user already exists, proceed
                          return response;
                        }
                      } catch {
                        throw new HttpException(
                          { message: 'Could not check user' },
                          HttpStatus.SERVICE_UNAVAILABLE,
                        );
                      }

                      // if (
                      //   response.createdNewRecipeUser &&
                      //   response.user.loginMethods.length === 1
                      // ) {
                      //   try {
                      //     await userDao.createNew(id, emails[0]);
                      //   } catch {
                      //     // User already exists
                      //     throw new HttpException(
                      //       {
                      //         message: 'User already exists',
                      //       },
                      //       HttpStatus.CONFLICT,
                      //     );
                      //   }
                      // } else {
                      //   // If this user has already been created (not new),
                      //   // Then we should check the database for their account.
                      //   // If it doesn't exist, then create it for them
                      // }
                    } else {
                      return response;
                    }
                  } else {
                    return {
                      status: 'RESTART_FLOW_ERROR',
                    };
                  }
                },
              };
            },
          },
        }),
        Session.init(),
        Dashboard.init(),
        UserRoles.init(),
      ],
    });
  }
}
