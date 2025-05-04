import { Module } from '@nestjs/common';

import { AzureStorageAdapter } from './adapters/azure-storage.adapter';

import { UploadController } from './upload.controller';

import { UploadService } from './upload.service';

@Module({
  controllers: [UploadController],
  providers: [
    UploadService,
    {
      provide: 'StorageAdapter',
      useClass: AzureStorageAdapter,
    },
  ],
  exports: [UploadService],
})
export class UploadModule {}
