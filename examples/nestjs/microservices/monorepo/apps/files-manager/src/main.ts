import { NestFactory } from '@nestjs/core';
import { FilesManagerModule } from './files-manager.module';

async function bootstrap() {
  const app = await NestFactory.create(FilesManagerModule);
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
