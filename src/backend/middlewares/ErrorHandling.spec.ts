/* eslint-disable import/no-extraneous-dependencies */
import { createMock } from '@golevelup/ts-jest';
import { Response } from 'express';

import { CustomRequest } from '#/backend/interfaces/CustomRequest';
import { ErrorHandling } from '#/backend/middlewares/ErrorHandling';
import { AppError, AppErrorType } from '#/backend/server/AppError';

describe('ErrorHandling.ts', () => {
  test('catchAll', async () => {
    const sut = new ErrorHandling();
    const mockRes = createMock<Response>({
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    });

    sut.catchAll(
      new AppError(AppErrorType.INTERNAL, 'something broke'),
      createMock<CustomRequest>(),
      mockRes,
      jest.fn(),
    );

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      statusCode: 500,
      type: 'INTERNAL',
      message: 'something broke',
      details: null,
    });
  });
});
