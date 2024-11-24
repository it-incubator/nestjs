import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CoreConfig } from './core/core.config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const coreConfig = appContext.get<CoreConfig>(CoreConfig);

  const appModule = await AppModule.forRoot(coreConfig);

  const app = await NestFactory.create(appModule);

  if (coreConfig.isSwaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('it-incubator Configuration example')
      .setDescription('The API description')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  console.log('process.env.PORT: ', coreConfig.port);
  await app.listen(coreConfig.port);
}
bootstrap();
