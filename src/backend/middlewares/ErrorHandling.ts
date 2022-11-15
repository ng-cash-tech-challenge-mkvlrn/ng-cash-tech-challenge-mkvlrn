import { NextFunction, Response } from 'express';

import { CustomRequest } from '#/backend/interfaces/CustomRequest';
import { AppError } from '#/backend/server/AppError';

export class ErrorHandling {
  catchAll = (
    err: AppError,
    _req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) =>
    next(
      res.status(err.statusCode).json({
        statusCode: err.statusCode,
        type: err.type,
        message: err.message,
        details: err.details,
      }),
    );
}
