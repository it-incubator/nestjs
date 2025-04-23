import { ConfigModule } from '@nestjs/config';
import { envFilePaths } from './env-file-paths';

// you must import this const in the head of your app.module.ts
export const configModule = ConfigModule.forRoot({
  envFilePath: envFilePaths,
  isGlobal: true,
});
