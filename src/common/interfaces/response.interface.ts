export interface ApiResponse<T> {
  data?: T | null;
  error: boolean;
  message: string;
  statusCode: number;
  timestamp: Date;
}
