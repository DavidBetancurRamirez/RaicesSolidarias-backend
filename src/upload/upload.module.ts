import { Module } from '@nestjs/common';

import { AzureStorageAdapter } from './adapters/azure-storage.adapter';
import { STORAGE_ADAPTER } from './adapters/constants.adapters';

import { UploadController } from './upload.controller';

import { AuthModule } from '@/auth/auth.module';

import { UploadService } from './upload.service';

@Module({
  imports: [AuthModule],
  controllers: [UploadController],
  providers: [
    UploadService,
    {
      provide: STORAGE_ADAPTER,
      useClass: AzureStorageAdapter,
    },
  ],
  exports: [UploadService],
})
export class UploadModule {}
