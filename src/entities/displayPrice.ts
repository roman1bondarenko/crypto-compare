import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Price } from './price';

@Entity('displayPrice')
export class DisplayPrice {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Price, (price) => price.id)
  price: Price;

  @Column()
  fsymType: string;

  @Column()
  tsymType: string;

  @Column()
  CHANGE24HOUR: string;

  @Column()
  CHANGEPCT24HOUR: string;

  @Column()
  OPEN24HOUR: string;

  @Column()
  VOLUME24HOUR: string;

  @Column()
  VOLUME24HOURTO: string;

  @Column({ nullable: true })
  FROMSYMBOL: string;

  @Column({ nullable: true })
  TOSYMBOL: string;

  @Column()
  LASTUPDATE: string;

  @Column()
  SUPPLY: string;

  @Column()
  MKTCAP: string;
}
