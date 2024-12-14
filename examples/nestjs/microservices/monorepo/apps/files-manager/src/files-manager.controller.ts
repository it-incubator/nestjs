import { Controller, Get } from '@nestjs/common';
import { FilesManagerService } from './files-manager.service';
import { CoreGlobalConfig } from '@app/core-library';
import { FileOutputDTO } from '@app/files-manager-library/dto';

@Controller()
export class FilesManagerController {
  constructor(
    private readonly filesManagerService: FilesManagerService,
    private readonly coreGlobalConfig: CoreGlobalConfig,
  ) {}

  @Get()
  getHello(): string {
    return (
      this.filesManagerService.getHello() +
      ' ' +
      this.coreGlobalConfig.accessTokenSecret()
    );
  }

  @Get('files')
  allFiles(): FileOutputDTO[] {
    return [{ id: 1, size: 1024, name: 'blabl', extension: 'mp4' }];
  }
}
