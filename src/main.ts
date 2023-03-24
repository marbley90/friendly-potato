if (!process.env.DEPLOY_ENV || process.env.DEPLOY_ENV == 'local') {
  require('dotenv').config();
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as requestIp from 'request-ip';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });

  app.use(requestIp.mw());

  await app.listen(process.env.PORT);

  console.log(`Friendly Potato API application started at port ${process.env.PORT}!`);
}
bootstrap();
