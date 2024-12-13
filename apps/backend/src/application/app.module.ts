import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '@core/common/config/database.config';
import { validate } from '@core/common/validation/env.validation';

@Module({
  imports: [
    AuthModule.forRoot({
      connectionURI: 'http://localhost.test:3567',
      apiKey: 'abcdefghijklmnopqrstuvwxyz',
      appInfo: {
        // Learn more about this on https://supertokens.com/docs/passwordless/appinfo
        appName: 'TraderDash',
        apiDomain: 'http://localhost.test:3000',
        websiteDomain: 'http://localhost.test:5173',
        apiBasePath: '/auth',
        websiteBasePath: '/login',
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validate: validate,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
