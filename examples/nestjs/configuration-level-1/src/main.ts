import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CoreConfig } from './core/core.config';

async function bootstrap() {
  // из-за того, что нам нужно донастроить динамический AppModule, мы не можем сразу создавать приложение
  // а создаём сначала контекст
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const coreConfig = appContext.get<CoreConfig>(CoreConfig);
  // как бы вручную инжектим в инициализацию модуля нужную зависимость, донастраивая динамический модуль
  const DynamicAppModule = await AppModule.forRoot(coreConfig);
  // и уже потом создаём на основе донастроенного модуля наше приложение
  const app = await NestFactory.create(DynamicAppModule);

  // Закрываем контекст, если он больше не нужен
  await appContext.close();

  // тут же используем управляемую нестом конфигурацию, чтобы включить или выключить swagger
  if (coreConfig.isSwaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('it-incubator Configuration example')
      .setDescription('The API description')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  // ПОРТ тоже достаём из coreConfig. Стараемся в коде забыть про дефолты вовсе, чтобы цент истины был в .env файлах
  console.log('process.env.PORT: ', coreConfig.port);
  await app.listen(coreConfig.port);
}
bootstrap();
