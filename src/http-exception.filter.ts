import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

const getStatus = (exception: unknown): number => {
  if (exception instanceof HttpException) {
    return exception.getStatus();
  }

  if (exception instanceof Error) {
    return HttpStatus.BAD_REQUEST;
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
};

const getMessage = (exception: any): string => {
  if (Array.isArray(exception.response.message)) {
    return exception.response.message;
  }

  if ( exception instanceof HttpException ) {
    return exception.message;
  }

  return 'Internal server error';
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = getStatus(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: getMessage(exception),
    });
  }
}
