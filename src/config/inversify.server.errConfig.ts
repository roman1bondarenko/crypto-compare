import chalk from 'chalk';
import * as express from 'express';
import { HttpError } from 'http-errors';

export const errConfig = (app: express.Application): void => {
  app.use((err: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const status = err.status || 500;

    res.status(status);

    const message = err.message || 'INTERNAL_SERVER_ERROR';

    console.error(chalk.bold.red(err));

    return res.json({
      message,
    });
  });
};
