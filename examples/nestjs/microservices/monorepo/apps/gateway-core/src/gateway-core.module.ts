import { Module } from '@nestjs/common';
import { GatewayCoreController } from './gateway-core.controller';
import { GatewayCoreService } from './gateway-core.service';
import { FilesManagerLibraryModule } from '@app/files-manager-library';

@Module({
  imports: [FilesManagerLibraryModule],
  controllers: [GatewayCoreController],
  providers: [GatewayCoreService],
})
export class GatewayCoreModule {}
