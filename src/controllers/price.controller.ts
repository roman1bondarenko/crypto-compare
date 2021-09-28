import {
    controller, httpGet, queryParam,
} from 'inversify-express-utils';

import axios from 'axios';
import { inject } from 'inversify';
import { TYPES } from '../services/types';
import { PriceService } from '../services/price.service';
import { PriceResponseI} from '../interfaces/priceResponce.inerfaces';

@controller('/')
export class PriceController {
  @inject(TYPES.PriceService) private priceService: PriceService;

  @httpGet('service/price')
  public async getPrice(
    @queryParam('fsyms') fsyms: string,
    @queryParam('tsyms') tsyms: string,
  ): Promise<PriceResponseI> {
    try {
      const { data } = await axios.get(
        'https://min-api.cryptocompare.com/data/pricemultifull'
        + `?fsyms=${fsyms}`
        + `&tsyms=${tsyms}`
        + `&api_key=${process.env.API_KEY}`,
      );

      const raw = await PriceService.filter(data.RAW, 'raw');
      const display = await PriceService.filter(data.DISPLAY, 'display');

      return {
        RAW: raw,
        DISPLAY: display,
      };
    } catch (error) {
      const fsymsArray = fsyms.split(',');
      const tsymsArray = tsyms.split(',');

      const raw = await this.priceService.getRawPrice(fsymsArray, tsymsArray);
      const display = await this.priceService.getDisplayPrice(fsymsArray, tsymsArray);

      return {
        RAW: raw,
        DISPLAY: display,
      };
    }
  }
}
