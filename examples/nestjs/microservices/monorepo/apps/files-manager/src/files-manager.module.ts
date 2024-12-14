import { Module } from '@nestjs/common';
import { FilesManagerController } from './files-manager.controller';
import { FilesManagerService } from './files-manager.service';
import { CoreLibraryModule } from '@app/core-library';

@Module({
  imports: [CoreLibraryModule],
  controllers: [FilesManagerController],
  providers: [FilesManagerService],
})
export class FilesManagerModule {}
