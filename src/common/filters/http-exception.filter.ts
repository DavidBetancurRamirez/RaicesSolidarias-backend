import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';

import { ApiResponse } from '../interfaces/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        if ('message' in res) {
          const errorMessage = (res as { message: string | string[] }).message || message;

          if (Array.isArray(errorMessage)) {
            message = errorMessage.join(', ');
          } else {
            message = errorMessage;
          }
        }
      }
    }

    const apiResponse: ApiResponse<any> = {
      error: true,
      message,
      statusCode: status,
      timestamp: new Date(),
    };

    console.error('[ERROR]', {
      method: request.method,
      path: request.url,
      statusCode: status,
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json(apiResponse);
  }
}
