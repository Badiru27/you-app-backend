import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './allExceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors();

  const port = process.env.PORT || 3344;
  await app.listen(port);
  return port;
}
bootstrap()
  .then((port) => console.log(`Application running on port ${port} 🚀🚀🚀`))
  .catch((error) => console.error(`Application fail to start due to ${error}`));
