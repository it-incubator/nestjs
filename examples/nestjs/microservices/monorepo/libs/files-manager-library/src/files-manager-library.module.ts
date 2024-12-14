import { Module } from '@nestjs/common';
import { FilesManagerApiClient } from '@app/files-manager-library/files-manager.api-client';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [FilesManagerApiClient],
  exports: [FilesManagerApiClient],
})
export class FilesManagerLibraryModule {}
