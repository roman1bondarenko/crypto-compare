interface RawPriceI extends Record<string, any> {
  CHANGE24HOUR: string;
  CHANGEPCT24HOUR: string;
  OPEN24HOUR: string;
  VOLUME24HOUR: string;
  VOLUME24HOURTO: string;
  LOW24HOUR: string;
  HIGH24HOUR: string;
  PRICE: string;
  LASTUPDATE: string;
  SUPPLY: string;
  MKTCAP: string;
}

interface DisplayPriceI extends Record<string, any> {
  CHANGE24HOUR: string;
  CHANGEPCT24HOUR: string;
  OPEN24HOUR: string;
  VOLUME24HOUR: string;
  VOLUME24HOURTO: string;
  LOW24HOUR: string;
  HIGH24HOUR: string;
  PRICE: string;
  LASTUPDATE: string;
  SUPPLY: string;
  MKTCAP: string;
}


interface TsymsI {
  [tsym: string]: RawPriceI | DisplayPriceI;
}

interface FsymsI {
  [fsym: string]: TsymsI;
}

export { DisplayPriceI, RawPriceI, TsymsI, FsymsI };
