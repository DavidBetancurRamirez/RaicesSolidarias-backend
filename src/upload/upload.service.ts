import { Inject, Injectable } from '@nestjs/common';

import { STORAGE_ADAPTER } from './adapters/constants.adapters';

import { StorageAdapter, UploadedFileResponse } from './interfaces/storage.interface';

@Injectable()
export class UploadService {
  constructor(@Inject(STORAGE_ADAPTER) private readonly storageAdapter: StorageAdapter) {}

  async deleteFiles(filenames: string[]): Promise<void> {
    for (const filename of filenames) {
      await this.storageAdapter.deleteFile(filename);
    }
  }

  async getFiles(names: string[]): Promise<string[]> {
    const results: string[] = [];

    for (const name of names) {
      const exists = await this.storageAdapter.fileExists(name);
      if (exists) {
        results.push(this.storageAdapter.getFileUrl(name));
      }
    }

    return results;
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadedFileResponse> {
    return this.storageAdapter.uploadFile(file);
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<UploadedFileResponse[]> {
    return this.storageAdapter.uploadFiles(files);
  }
}
