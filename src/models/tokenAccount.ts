import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Transaction } from './transaction';
import type { Link } from './link';
import type { ChainInfo } from './chain';

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

  @ManyToOne('ChainInfo', 'tokenAccounts')
  @JoinColumn({ name: 'networkId' })
  chainInfo: Relation<ChainInfo>;

  @OneToMany('Transaction', 'sourceTokenInfo')
  transactions: Relation<Transaction[]>;

  @OneToMany('Link', 'destinationTokenInfo')
  links: Relation<Link[]>;
}
