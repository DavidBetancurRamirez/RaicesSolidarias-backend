import { Injectable } from '@nestjs/common';
import { StorageAdapter } from './interfaces/storage.interface';

@Injectable()
export class UploadService {
  constructor(private readonly storage: StorageAdapter) {}

  async uploadFile(file: Express.Multer.File) {
    return this.storage.uploadFile(file);
  }

  async uploadFiles(files: Express.Multer.File[]) {
    return this.storage.uploadFiles(files);
  }
}
