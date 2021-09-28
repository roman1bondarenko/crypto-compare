interface DbRawPriceI extends Record<string, any> {
  id?: number,
  fsymType?: string,
  tsymType?: string,
  price?: any;
  CHANGE24HOUR: number;
  CHANGEPCT24HOUR: number;
  OPEN24HOUR: number;
  VOLUME24HOUR: string;
  VOLUME24HOURTO: string;
  LOW24HOUR: string;
  HIGH24HOUR: string;
  PRICE: string;
  LASTUPDATE: number;
  SUPPLY: string;
  MKTCAP: string;
}

interface DbDisplayPriceI extends Record<string, any> {
  id?: number,
  fsymType?: string,
  tsymType?: string,
  price?: any;
  CHANGE24HOUR: string;
  CHANGEPCT24HOUR: string;
  OPEN24HOUR: string;
  VOLUME24HOUR: string;
  VOLUME24HOURTO: string;
  LASTUPDATE: string;
  SUPPLY: string;
  MKTCAP: string;
}

interface DbTsymsI {
  [tsym: string]: DbRawPriceI | DbDisplayPriceI;
}

interface DbFsymsI {
  [fsym: string]: DbTsymsI;
}

export { DbDisplayPriceI, DbRawPriceI,  DbFsymsI, DbTsymsI };
