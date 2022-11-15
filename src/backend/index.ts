import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import 'reflect-metadata';
import { container } from 'tsyringe';

import { Envs } from '#/backend/server/Envs';
import { Server } from '#/backend/server/Server';

container.register(PrismaClient, { useValue: new PrismaClient() });
container.register(Redis, {
  useValue: new Redis(Envs.REDIS_URL, { lazyConnect: true }),
});
const server = container.resolve(Server);

server.start(+Envs.PORT);
