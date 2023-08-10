import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // whenever a validation decorator is encountered
  // the below line specifies to run the validation instead of asking each controller
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
