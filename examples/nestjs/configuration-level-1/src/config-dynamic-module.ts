import { ConfigModule } from '@nestjs/config';

// you must import this const in the head of your app.module.ts
export const configModule = ConfigModule.forRoot({
  envFilePath: [
    process.env.ENV_FILE_PATH?.trim() || '',
    `.env.${process.env.NODE_ENV}.local`,
    `.env.${process.env.NODE_ENV}`,
    '.env.production',
  ],
  isGlobal: true,
});
