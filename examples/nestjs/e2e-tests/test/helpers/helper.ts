import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { MailService } from '../../src/common/services/mail.service';
import { AuthConfig } from '../../src/auth/config/auth.config';
import { setupApp } from '../../src/config/setup-app';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

class MailServiceMock implements MailService {
  send(to: string, subject: string, body: string): void {
    console.log(`Email REALLY NOT not sent, to: ${to}, subject: ${subject}, body: 
---------
${body}`);
  }
}

export const initApp = async (
  customBuilderSetup = (builder: TestingModuleBuilder) => {},
) => {
  const testingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(MailService)
    .useClass(MailServiceMock)
    .overrideProvider(AuthConfig)
    .useValue({
      jwtSecret: '123',
      skipPasswordCheck: true,
    } as AuthConfig);

  customBuilderSetup(testingModuleBuilder);

  const moduleFixture: TestingModule = await testingModuleBuilder.compile();

  const app: INestApplication = moduleFixture.createNestApplication();

  setupApp(app);

  await app.init();

  await clearDB(moduleFixture);

  return app;
};

export const clearDB = async (moduleFixture: TestingModule) => {
  // Получаем подключение к базе данных
  const connection = moduleFixture.get<Connection>(getConnectionToken());

  // Очистка всех коллекций в тестовой базе данных
  const collections = await connection.db.listCollections().toArray();
  for (const collection of collections) {
    await connection.db.collection(collection.name).deleteMany({});
  }
};
