import { Container } from 'inversify';
import { TYPE } from 'inversify-express-utils';
import { Interfaces } from 'inversify-socket-utils';
import { TYPES } from './services/types';

import { PriceService } from './services/price.service';
import { PriceWsController } from './controllers/priceSocket.controller';

const container = new Container();

container.bind<PriceService>(TYPES.PriceService).to(PriceService);
container.bind<Interfaces.Controller>(TYPE.Controller).to(PriceWsController);

export default container;
