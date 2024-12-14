import { Module } from '@nestjs/common';
import { CoreGlobalConfig } from './core-global.config';

@Module({
  providers: [CoreGlobalConfig],
  exports: [CoreGlobalConfig],
})
export class CoreLibraryModule {}
