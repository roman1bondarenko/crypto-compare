import { Container } from 'inversify';
import { TYPES } from './services/types';

import { PriceService } from './services/price.service';

const container = new Container();

container.bind<PriceService>(TYPES.PriceService).to(PriceService);

export default container;
