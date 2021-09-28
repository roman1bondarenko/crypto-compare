import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Price } from './price';

@Entity('rawPrice')
export class RawPrice {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Price, (price) => price.id)
  price: Price;

  @Column()
  fsymType: string;

  @Column()
  tsymType: string;

  @Column()
  CHANGE24HOUR: number;

  @Column()
  CHANGEPCT24HOUR: number;

  @Column()
  OPEN24HOUR: number;

  @Column({ type: 'bigint' })
  VOLUME24HOUR: string;

  @Column({ type: 'bigint' })
  VOLUME24HOURTO: string;

  @Column({ type: 'bigint' })
  LOW24HOUR: string;

  @Column({ type: 'bigint' })
  HIGH24HOUR: string;

  @Column({ type: 'bigint' })
  PRICE: string;

  @Column()
  LASTUPDATE: number;

  @Column({ type: 'bigint' })
  SUPPLY: string;

  @Column({ type: 'bigint' })
  MKTCAP: string;
}
