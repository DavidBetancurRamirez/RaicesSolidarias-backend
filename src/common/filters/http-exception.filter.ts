import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { ApiResponse } from '../interfaces/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        if (typeof res === 'object' && 'message' in res) {
          message = (res as { message: string }).message || message;
        }
      }
    }

    const apiResponse: ApiResponse<any> = {
      error: true,
      message,
      statusCode: status,
      timestamp: new Date(),
    };

    response.status(status).json(apiResponse);
  }
}
