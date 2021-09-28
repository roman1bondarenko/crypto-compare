import { FsymsI } from "./cryptocampare.interface";
import { DbFsymsI } from "./database.interface";

interface PriceResponseI {
  RAW: FsymsI | DbFsymsI,
  DISPLAY: FsymsI | DbFsymsI,
}

export { PriceResponseI };
