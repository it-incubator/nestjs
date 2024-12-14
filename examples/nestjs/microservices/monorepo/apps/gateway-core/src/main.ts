import { NestFactory } from '@nestjs/core';
import { GatewayCoreModule } from './gateway-core.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayCoreModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
