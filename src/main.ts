if (!process.env.DEPLOY_ENV || process.env.DEPLOY_ENV == 'local') {
  require('dotenv').config();
}
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
      .setTitle('Friendly Potato')
      .setDescription('Friendly Potato API description')
      .setVersion('1.0')
      .addTag('GEO')
      .addBearerAuth()
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);

  console.log(`Friendly Potato API application started at port ${process.env.PORT}!`);
}
bootstrap();
