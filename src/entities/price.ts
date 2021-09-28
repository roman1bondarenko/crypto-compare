import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { DisplayPrice } from './displayPrice';
import { RawPrice } from './rawPrice';

@Entity('price')
export class Price {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToMany(() => RawPrice, (rawPrice) => rawPrice.price)
  rawPrice: RawPrice[];

  @OneToMany(() => DisplayPrice, (displayPrice) => displayPrice.price)
  displayPrice: DisplayPrice[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public created_at: string;
}
