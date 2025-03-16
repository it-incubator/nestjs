import { ConfigModule } from '@nestjs/config';
import { envFilePaths } from './env-file-paths';

export const configModule = ConfigModule.forRoot({
  envFilePath: envFilePaths,
  isGlobal: true,
});
