import { Test, TestingModule } from '@nestjs/testing';
import { CoreGlobalConfig } from './core-global.config';

describe('CoreLibraryService', () => {
  let service: CoreGlobalConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreGlobalConfig],
    }).compile();

    service = module.get<CoreGlobalConfig>(CoreGlobalConfig);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
