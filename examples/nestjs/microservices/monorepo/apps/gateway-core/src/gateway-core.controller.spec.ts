import { Test, TestingModule } from '@nestjs/testing';
import { GatewayCoreController } from './gateway-core.controller';
import { GatewayCoreService } from './gateway-core.service';

describe('GatewayCoreController', () => {
  let gatewayCoreController: GatewayCoreController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GatewayCoreController],
      providers: [GatewayCoreService],
    }).compile();

    gatewayCoreController = app.get<GatewayCoreController>(GatewayCoreController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(gatewayCoreController.getHello()).toBe('Hello World!');
    });
  });
});
