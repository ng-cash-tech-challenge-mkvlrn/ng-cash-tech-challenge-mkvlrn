/* eslint-disable import/no-extraneous-dependencies */
import { createMock } from '@golevelup/ts-jest';
import { Server as HttpServer } from 'http';
import 'reflect-metadata';

import { Server } from '#/backend/server/Server';

describe('Server.ts', () => {
  let listener: HttpServer;

  afterAll(() => {
    listener.close();
  });

  test('server starts', () => {
    const sut = new Server(createMock(), createMock());

    listener = sut.start(4002);

    expect(listener).toBeDefined();
  });
});
