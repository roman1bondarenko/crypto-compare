import { getConnection } from 'typeorm';
import axios from 'axios';

import { Queue, Worker } from 'bullmq';

import { PriceService } from '../services/price.service';
import { Price } from '../entities/price';
import { RawPrice } from '../entities/rawPrice';
import { DisplayPrice } from '../entities/displayPrice';
import { FsymsI } from 'src/interfaces/cryptocampare.interface';
import IORedis from 'ioredis';

const connection = new IORedis();

const queue = new Queue('Price', { connection: connection });

const savePriceDataInDb = (type: 'raw' | 'display', price: Price, data: FsymsI) => {
  Object.keys(data).forEach((fsymType) => Object.keys(data[fsymType]).forEach((tsymType) => {
    let priceTypeEntity;

    if (type === 'raw') {
      priceTypeEntity = new RawPrice();
    } else {
      priceTypeEntity = new DisplayPrice();
    }

    priceTypeEntity = Object.assign(data[fsymType][tsymType]);

    priceTypeEntity.fsymType = fsymType;
    priceTypeEntity.tsymType = tsymType;
    priceTypeEntity.price = price

    if (type === 'raw') {
      const rawPriceRepository = getConnection('default').getRepository(RawPrice);
      rawPriceRepository.save(priceTypeEntity);
    } else {
      const displayPriceRepository = getConnection('default').getRepository(DisplayPrice);
      displayPriceRepository.save(priceTypeEntity);
    }
  }));
};

const savePrice = async () => {
    console.log('job cron...');
    const { data } = await axios.get(
        'https://min-api.cryptocompare.com/data/pricemultifull'
        + '?fsyms=BTC,XRP,ETH,BCH,EOS,LTC,XMR,DASH'
        + `&tsyms=USD,EUR,GBP,JPY,RUR&api_key=${process.env.API_KEY}`,
    );

    const raw = await PriceService.filter(data.RAW, 'raw');
    const display = await PriceService.filter(data.DISPLAY, 'display');

    const priceRepository = getConnection('default').getRepository(Price);

    const price = new Price();
    await priceRepository.save(price);

    savePriceDataInDb('raw', price, raw);
    savePriceDataInDb('display', price, display)
};

queue.add('price',
    'price',
    {
        repeat: {
            every: 60000,
            limit: 1,
        },
    }
);

new Worker('Price', async job => {
  if (job.name === 'price') {
    await savePrice();
  }
}, { connection });
