export interface UploadedFileResponse {
  url: string;
  filename: string;
}

export interface StorageAdapter {
  deleteFile(filename: string): Promise<void>;
  fileExists(filename: string): Promise<boolean>;
  getFileUrl(filename: string): string;
  uploadFile(file: Express.Multer.File): Promise<UploadedFileResponse>;
  uploadFiles(files: Express.Multer.File[]): Promise<UploadedFileResponse[]>;
}
