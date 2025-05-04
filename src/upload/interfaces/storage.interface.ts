export interface UploadedFileResponse {
  url: string;
  filename: string;
}

export interface StorageAdapter {
  uploadFile(file: Express.Multer.File): Promise<UploadedFileResponse>;
  uploadFiles(files: Express.Multer.File[]): Promise<UploadedFileResponse[]>;
  deleteFile?(filename: string): Promise<void>;
}
