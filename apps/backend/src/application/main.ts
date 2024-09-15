import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import supertokens from 'supertokens-node';
import { SupertokensExceptionFilter } from './auth/auth.filter';

const PORT: number = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`Starting server on port ${PORT}`);
  app.enableCors({
    origin: ['http://localhost:5173'],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });
  app.useGlobalFilters(new SupertokensExceptionFilter());
  app.enableShutdownHooks();
  await app.listen(PORT);
}
bootstrap();
