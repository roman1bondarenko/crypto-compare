import 'dotenv/config';
import 'reflect-metadata';
import * as http from 'http';
import * as SocketIO from 'socket.io';
import { InversifyExpressServer } from 'inversify-express-utils';
import { InversifySocketServer } from 'inversify-socket-utils';

import './controllers/price.controller';
import { getDbConnection } from './config/db';

import container from './inversify.config';
import containerWS from './inversify.config.ws';

import { config } from './config/inversify.server.config';
import { errConfig } from './config/inversify.server.errConfig';

import './jobs/fetchPrice';

(async () => {
  await getDbConnection();

  const app = new InversifyExpressServer(container);

  app
      .setConfig(config)
      .setErrorConfig(errConfig);

  const server = app.build();

  server.listen(3000, () => {
      console.log(`Server running at http://127.0.0.1:${3000}/`);
  });

  const appWS = http.createServer();
  const io = new SocketIO.Server(appWS);
  const serverWS = new InversifySocketServer(containerWS, io);
  serverWS.build();

  appWS.listen(3001, () => {
      console.log(`Server running at http://127.0.0.1:${3001}/`);
  });
})();
