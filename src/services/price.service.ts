import { injectable } from 'inversify';
import {
  getConnection,
  Repository,
} from 'typeorm';

import { Price } from '../entities/price';
import { DisplayPrice } from '../entities/displayPrice';
import { RawPrice } from '../entities/rawPrice';

import { DisplayPriceI, FsymsI, RawPriceI, TsymsI } from '../interfaces/cryptocampare.interface';
import { DbDisplayPriceI, DbFsymsI, DbRawPriceI, DbTsymsI } from '../interfaces/database.interface';

const allowed = {
  raw: [
      'CHANGE24HOUR',
      'CHANGEPCT24HOUR',
      'OPEN24HOUR',
      'VOLUME24HOUR',
      'VOLUME24HOURTO',
      'HIGH24HOUR',
      'LOW24HOUR',
      'PRICE',
      'LASTUPDATE',
      'SUPPLY',
      'MKTCAP',
  ],
  display: [
      'CHANGE24HOUR',
      'CHANGEPCT24HOUR',
      'OPEN24HOUR',
      'VOLUME24HOUR',
      'VOLUME24HOURTO',
      'HIGH24HOUR',
      'PRICE',
      'FROMSYMBOL',
      'TOSYMBOL',
      'LASTUPDATE',
      'SUPPLY',
      'MKTCAP',
  ],
};

@injectable()
export class PriceService {
  private priceRepository: Repository<Price>;
  static displayPriceRepository: Repository<DisplayPrice>;
  static rawPriceRepository: Repository<RawPrice>;

  constructor() {
    this.priceRepository = getConnection().getRepository<Price>('price');
  }

  static filterObject(
    fsyms: DbFsymsI,
    fsymKey: string,
    tsymKey: string,
    tsym: RawPriceI | DbRawPriceI | DbRawPriceI | DbDisplayPriceI,
    arrayOfProperties: string[]
  ): DbTsymsI {
    return Object
      .keys(tsym)
      .filter((properety: string) => arrayOfProperties.includes(properety))
      .reduce((
        tsymProperties: RawPriceI | DisplayPriceI | DbDisplayPriceI | DbRawPriceI,
        properetyOfTsym: string,
      ) => ({
        ...tsymProperties,
        [properetyOfTsym]: fsyms[fsymKey][tsymKey][properetyOfTsym],

      }), {} as RawPriceI | DisplayPriceI | DbDisplayPriceI | DbRawPriceI);
  }

  static async filter(fsyms: DbFsymsI, type: 'raw' | 'display'): Promise<FsymsI> {
    const fsymKeys = Object.keys(fsyms);
    const fsymsWithTsymsKeys = fsymKeys.reduce((fsyms: any, fsymKey: string) => ({
      ...fsyms,
      [fsymKey]: Object.keys(fsyms[fsymKey])
    }), {});

    return fsymKeys.reduce((fsyms: any, fsymKey: string) => ({
      ...fsyms,
      [fsymKey]: fsymsWithTsymsKeys[fsymKey].reduce((tsyms: any, tsymKey: string) => ({
        ...tsyms,
        [tsymKey]: this.filterObject(
          fsyms,
          fsymKey,
          tsymKey,
          fsyms[fsymKey][tsymKey],
          allowed[type])
      }), {})
    }), {});
  }

  async getRawPrice(fsyms: string[], tsyms: string[]): Promise<DbFsymsI> {
    const data: Price = await this.priceRepository
      .createQueryBuilder('price')
      .orderBy('price.id', 'DESC')
      .leftJoinAndSelect('price.rawPrice', 'rawPrice')
      .where('rawPrice.fsymType IN (:...fsyms) AND rawPrice.tsymType IN (:...tsyms)', { fsyms, tsyms })
      .getOneOrFail();

    const result = data.rawPrice.reduce((records: DbFsymsI, { id, fsymType, tsymType, ...propereties }) => ({
      ...records,
        [fsymType]: {
          ...records[fsymType],
          [tsymType]: {
            ...propereties,
          },
        },
    }), {});

    return result;
  }

  async getDisplayPrice(fsyms: string[], tsyms: string[]): Promise<DbFsymsI> {
    const data = await this.priceRepository
      .createQueryBuilder('price')
      .orderBy('price.id', 'DESC')
      .leftJoinAndSelect('price.displayPrice', 'displayPrice')
      .where('displayPrice.fsymType IN (:...fsyms) AND displayPrice.tsymType IN (:...tsyms)', { fsyms, tsyms })
      .getOneOrFail();

    const result = data.displayPrice.reduce((records: DbFsymsI, { id, fsymType, tsymType, ...propereties }) => ({
        ...records,
        [fsymType]: {
          ...records[fsymType],
          [tsymType]: {
            ...propereties,
          },
        },
    }), {});

    return result;
  }
}
