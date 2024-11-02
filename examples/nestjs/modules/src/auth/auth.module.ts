import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './auth-service/auth.service';

@Module({})
export class AuthModule {
  static register(hasRightStrategy: () => boolean): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: AuthService,
          useFactory: async () => {
            return new AuthService(hasRightStrategy);
          },
        },
      ],
      exports: [AuthService],
    };
  }
}
