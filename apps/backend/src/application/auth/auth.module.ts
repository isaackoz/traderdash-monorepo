import { Module } from '@nestjs/common';
import { SupertokensService } from './supertokens/supertokens.service';
import { MiddlewareConsumer, NestModule, DynamicModule } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';
import { ConfigInjectionToken, AuthModuleConfig } from './config.interface';
import { DatabaseModule } from '@core/common/database/database.module';

@Module({
  providers: [],
  exports: [],
  controllers: [],
  imports: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }

  static forRoot({
    connectionURI,
    apiKey,
    appInfo,
  }: AuthModuleConfig): DynamicModule {
    return {
      providers: [
        {
          useValue: {
            appInfo,
            connectionURI,
            apiKey,
          },
          provide: ConfigInjectionToken,
        },
        SupertokensService,
      ],
      exports: [],
      imports: [DatabaseModule],
      module: AuthModule,
    };
  }
}
