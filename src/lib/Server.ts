import 'express-async-errors';
import express, { ErrorRequestHandler } from 'express';
import LoggerFactory from '../factories/LoggerFactory';
import { inject, injectable } from 'inversify';
import Settings from '../types/Settings';
import compression from 'compression';
import { Logger } from 'winston';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';
import { UserController } from '../controllers/UserController';

@injectable()
class Server {
  app: express.Application;
  private port: number;
  private server: http.Server;
  logger = new LoggerFactory().apply();

  constructor(
    @inject('Settings') settings: Settings,
    @inject('Logger') logger: Logger,
    @inject(UserController) userController: UserController
  ) {
    this.port = settings.port;
    this.logger = logger;

    this.app = express()
      .use(helmet())
      .use(compression())
      .use(express.json())
      .use(express.urlencoded({ extended: true }))
      .use(cors())
      .use('/user', userController.router)
      .use(this.authErrorHandler)
      .use(this.generalErrorHandler);

    this.server = http.createServer(this.app);
  }

  authErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err.name != 'UnauthorizedError') return next(err);

    this.logger.error('Authorization Error');
    res.status(401).end();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    this.logger.error('Application Error', err);
    res.status(500).end();
  };

  start(): void {
    this.server.listen(this.port, () => this.logger.info('Live on: ' + this.port));
  }
}

export default Server;
