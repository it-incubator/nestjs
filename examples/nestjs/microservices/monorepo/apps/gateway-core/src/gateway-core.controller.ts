import { Controller, Get } from '@nestjs/common';
import { GatewayCoreService } from './gateway-core.service';
import { FilesManagerApiClient } from '@app/files-manager-library/files-manager.api-client';
import { FileOutputDTO } from '@app/files-manager-library';

@Controller()
export class GatewayCoreController {
  constructor(
    private readonly gatewayCoreService: GatewayCoreService,
    private readonly filesManagerApiClient: FilesManagerApiClient,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const files: FileOutputDTO[] = await this.filesManagerApiClient.getFiles();

    return (
      this.gatewayCoreService.getHello() +
      files.map((f) => f.name + '.' + f.extension)
    );
  }
}
