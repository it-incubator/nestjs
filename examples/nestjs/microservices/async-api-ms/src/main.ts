import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { makeAsyncapiDocument } from './async-api-helper';
import { INestApplication, Logger } from '@nestjs/common';
import { AsyncApiModule } from 'nestjs-asyncapi';
import { BOOTSTRAP, DOC_RELATIVE_PATH, HOST, PORT } from './constants';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule);
  const asyncapiDocument = await makeAsyncapiDocument(app);
  await AsyncApiModule.setup(DOC_RELATIVE_PATH, app, asyncapiDocument);

  app.connectMicroservice<MicroserviceOptions>({ transport: Transport.TCP });

  await app.startAllMicroservices();
  await app.listen(PORT, HOST);

  const baseUrl = `http://${HOST}:${PORT}`;
  const docUrl = baseUrl + DOC_RELATIVE_PATH;
  Logger.log(`Server started at ${baseUrl}; AsyncApi at ${docUrl};`, BOOTSTRAP);
}
bootstrap();
