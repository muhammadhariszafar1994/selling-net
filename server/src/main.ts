import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // HTTPS Options Setup
  let httpsOptions = null;
  if (
      fs.existsSync(process.env.SSL_KEY) &&
      fs.existsSync(process.env.SSL_CERTIFICATE)
  ) {
    console.log('SSL key found!');
    httpsOptions = {
      key: fs.readFileSync(process.env.SSL_KEY),
      cert: fs.readFileSync(process.env.SSL_CERTIFICATE),
    };
  }

  // Register plugins dynamically with AppModule
  const app = await NestFactory.create(AppModule, { httpsOptions, cors: true });

  // Enable CORS
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();