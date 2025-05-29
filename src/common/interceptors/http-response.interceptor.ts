import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { ApiResponse } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<ApiResponse<T>>();
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        const apiResponse: ApiResponse<T> = {
          data: data || null,
          error: false,
          message: response.message || 'Operation successful',
          statusCode: response.statusCode,
          timestamp: new Date(),
        };

        console.log('[RESPONSE]', {
          method: request.method,
          path: request.url,
          statusCode: apiResponse.statusCode,
          message: apiResponse.message,
          data: apiResponse.data,
        });

        return apiResponse;
      }),
    );
  }
}
