import { Test, TestingModule } from '@nestjs/testing';
import { FilesManagerController } from './files-manager.controller';
import { FilesManagerService } from './files-manager.service';

describe('FilesManagerController', () => {
  let filesManagerController: FilesManagerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FilesManagerController],
      providers: [FilesManagerService],
    }).compile();

    filesManagerController = app.get<FilesManagerController>(FilesManagerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(filesManagerController.getHello()).toBe('Hello World!');
    });
  });
});
