import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

/**
 * Every error response is `{ error: string, errorCode?: string }`, the
 * contract the clients rely on. `error` is for people (validation messages
 * are joined into one string); `errorCode` is for code, e.g. auth failures
 * from @nestjs/authentication (`missing_credentials`, `invalid_token`, ...).
 */
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const errorCode = errorCodeOf(exception);
      res.status(exception.getStatus()).json({
        error: messageOf(exception),
        ...(errorCode && { errorCode }),
      });
      return;
    }

    this.logger.error(
      exception instanceof Error ? exception.stack : String(exception)
    );
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' });
  }
}

function messageOf(exception: HttpException): string {
  const body = exception.getResponse();
  if (typeof body === 'string') return body;
  const message = (body as { message?: string | string[] }).message;
  if (Array.isArray(message)) return message.join(', ');
  return message ?? exception.message;
}

function errorCodeOf(exception: HttpException): string | undefined {
  const body = exception.getResponse();
  const code =
    typeof body === 'object'
      ? (body as { errorCode?: unknown }).errorCode
      : undefined;
  return typeof code === 'string' ? code : undefined;
}
