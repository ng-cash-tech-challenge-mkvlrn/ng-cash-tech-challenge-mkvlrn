import { Server as HttpServer } from 'http';

import { Server } from '#/backend/server/Server';

describe('Server.ts', () => {
  let listener: HttpServer;

  afterAll(() => {
    listener.close();
  });

  test('server starts', () => {
    const sut = new Server();

    listener = sut.start(4002);

    expect(listener).toBeDefined();
  });
});
