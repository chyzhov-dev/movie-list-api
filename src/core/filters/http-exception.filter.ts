import { getExceptionMessage, getExceptionStatus } from '@core/utils/exception';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Global filter for exceptions
   * @param {unknown} exception exception object
   * @param {ArgumentsHost} host arguments passed to a handler
   */
  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = getExceptionStatus(exception);

    response.status(status).json({
      // statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: getExceptionMessage(exception),
    });
  }
}
