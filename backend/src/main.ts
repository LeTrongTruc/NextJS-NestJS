import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExceptionsLoggerFilter } from './common/exceptionsLogger.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsLoggerFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Blog APIs')
    .setDescription('List API')
    .addTag('Auth').addTag('Users')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.setGlobalPrefix('api');
  app.enableCors();
  SwaggerModule.setup('api', app, document);
  await app.listen(3005);
}
bootstrap();
