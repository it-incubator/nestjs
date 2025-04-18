import { Test, TestingModule } from '@nestjs/testing';
import { AuthConfig } from './auth.config';

describe('AuthConfigService', () => {
  let service: AuthConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthConfig],
    }).compile();

    service = module.get<AuthConfig>(AuthConfig);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
