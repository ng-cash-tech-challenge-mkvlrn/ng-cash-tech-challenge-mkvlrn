import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import { createServer, Server as HttpServer } from 'http';
import { AddressInfo } from 'net';
import { injectable } from 'tsyringe';

import { ErrorHandling } from '#/backend/middlewares/ErrorHandling';
import { AppRouter } from '#/backend/server/AppRouter';

@injectable()
export class Server {
  private app = express();

  private httpServer: HttpServer;

  constructor(private errorHandler: ErrorHandling, private router: AppRouter) {
    this.app.use(
      cors({
        credentials: true,
        origin: [
          'http://localhost:3001',
          'http://localhost:4001',
          'http://localhost:80',
          'http://localhost',
          'https://ng-cash-tech-challenge-mkvlrn.azurewebsites.net',
        ],
      }),
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.app.use(this.router.routes);
    this.app.use(this.errorHandler.catchAll);

    this.httpServer = createServer(this.app);
    this.httpServer.on('listening', () => {
      // eslint-disable-next-line no-console
      console.log(
        `server up @${(this.httpServer.address() as AddressInfo).port}`,
      );
    });
  }

  start = (port: number) => this.httpServer.listen(port);
}
