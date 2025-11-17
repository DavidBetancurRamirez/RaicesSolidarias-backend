import { Inject, Injectable } from '@nestjs/common';

import { STORAGE_ADAPTER } from './adapters/constants.adapters';

import { StorageAdapter, UploadedFileResponse } from './interfaces/storage.interface';
import { TypeOfMedia } from '@/common/dto/media.dto';

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
    const storageResponse = await this.storageAdapter.uploadFile(file);

    // Determine the type of the file based on its MIME type
    let type: TypeOfMedia = 'other';
    if (storageResponse.mimetype.startsWith('image/')) {
      type = 'image';
    } else if (storageResponse.mimetype.startsWith('video/')) {
      type = 'video';
    }

    return {
      url: storageResponse.url,
      filename: storageResponse.filename,
      type,
    };
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<UploadedFileResponse[]> {
    const storageResponses = await this.storageAdapter.uploadFiles(files);

    return storageResponses.map((storageResponse) => {
      let type: TypeOfMedia = 'other';
      if (storageResponse.mimetype.startsWith('image/')) {
        type = 'image';
      } else if (storageResponse.mimetype.startsWith('video/')) {
        type = 'video';
      }

      return {
        url: storageResponse.url,
        filename: storageResponse.filename,
        type,
      };
    });
  }
}
