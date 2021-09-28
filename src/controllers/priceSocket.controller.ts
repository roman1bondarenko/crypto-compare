import { inject, injectable } from 'inversify';
import { Controller, Payload, ConnectedSocket, OnConnect, OnDisconnect, OnMessage } from 'inversify-socket-utils';
import 'reflect-metadata';
import { PriceService } from '../services/price.service';
import { TYPES } from '../services/types';

@injectable()
@Controller(
  '/service/price',
)
export class PriceWsController {
  @inject(TYPES.PriceService) private priceService: PriceService;

  @OnConnect('connection')
  connection() {
    console.log('Client connected');
  }

  @OnDisconnect('disconnect')
  disconnect() {
    console.log('Client disconnected');
  }

  @OnMessage('message')
  async message(@Payload() payload: any, @ConnectedSocket() socket: any) {
    const fsymsArray = payload.fsyms.split(',');
    const tsymsArray = payload.tsyms.split(',');

    const raw = await this.priceService.getRawPrice(fsymsArray, tsymsArray);
    const display = await this.priceService.getDisplayPrice(fsymsArray, tsymsArray);

    socket.emit('message', {
        RAW: raw,
        DISPLAY: display,
    });
  }
}
