import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  
  // Konfigurasi Swagger
  const config = new DocumentBuilder()
    .setTitle('cafe reservation API')
    .setDescription('API for managing cafe reservations, users, and admins')
    .setVersion('1.0')
    // Tambah Opsi Pengujian Token JWT
    .addBearerAuth()
    .build()

    const document = SwaggerModule.createDocument(app, config)

    SwaggerModule.setup('api/docs', app, document)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

