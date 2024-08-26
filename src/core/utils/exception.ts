import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Get status from exception object
 * @param {unknown} exception exception object
 * @return {number}
 */
export const getExceptionStatus = (exception: unknown): number => {
  if (exception instanceof HttpException) {
    return exception.getStatus();
  }

  if (exception instanceof Error) {
    return HttpStatus.BAD_REQUEST;
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
};

/**
 * Get message from exception object
 * @param {unknown} exception exception object
 * @return {string}
 */
export const getExceptionMessage = (exception: unknown): string => {
  // if (Array.isArray(exception.response?.message)) {
  //   return exception.response.message;
  // }

  if (exception instanceof HttpException) {
    return exception.message;
  }

  return 'Internal server error';
};
