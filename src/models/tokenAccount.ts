import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
  Relation,
} from 'typeorm';
import type { Transaction } from './transaction';
import type { Link } from './link';

@Entity()
export class TokenAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tokenAddress: string;

  @Column()
  chainId: number;

  @Column()
  chainName: string;

  @Column()
  decimals: number;

  @Column()
  logoURI: string;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @OneToMany('Transaction', 'sourceTokenInfo')
  transactions: Relation<Transaction[]>;

  @OneToMany('Link', 'destinationTokenInfo')
  links: Relation<Link[]>;
}
