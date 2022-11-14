import cors from 'cors';
import express from 'express';
import { createServer, Server as HttpServer } from 'http';
import { AddressInfo } from 'net';

export class Server {
  private app = express();

  private httpServer: HttpServer;

  constructor() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

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
