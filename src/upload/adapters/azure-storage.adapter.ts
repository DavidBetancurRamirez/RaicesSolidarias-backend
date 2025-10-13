import { Injectable } from '@nestjs/common';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

import { StorageAdapter, UploadedFileResponse } from '../interfaces/storage.interface';

@Injectable()
export class AzureStorageAdapter implements StorageAdapter {
  private containerClient: ContainerClient;

  constructor() {
    const AZURE_CONNECTION = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;
    if (!AZURE_CONNECTION || !CONTAINER_NAME) {
      throw new Error(
        'Azure Storage connection string and container name must be provided in environment variables.',
      );
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION);
    this.containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  }

  async deleteFile(filename: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(filename);
    await blockBlobClient.deleteIfExists();
  }

  async fileExists(filename: string): Promise<boolean> {
    const blobClient = this.containerClient.getBlockBlobClient(filename);
    return await blobClient.exists();
  }

  getFileUrl(filename: string): string {
    const blobClient = this.containerClient.getBlockBlobClient(filename);
    return blobClient.url;
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadedFileResponse> {
    const filename = file.originalname;

    const blockBlobClient = this.containerClient.getBlockBlobClient(filename);
    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    // Determine the type of the file based on its MIME type
    let type: 'image' | 'video' | 'other' = 'other';
    if (file.mimetype.startsWith('image/')) {
      type = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      type = 'video';
    }

    return {
      url: blockBlobClient.url,
      filename,
      type,
    };
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<UploadedFileResponse[]> {
    return Promise.all(files.map((file) => this.uploadFile(file)));
  }
}
