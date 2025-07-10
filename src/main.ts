import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());

  const appService = app.get(AppService);
  appService.setWebHookBot();
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  });

  await app.listen(port);

  process.on('SIGINT', async () => {
    await app.close();
    process.exit(0);
  });
}
bootstrap();
