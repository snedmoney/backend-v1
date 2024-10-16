import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Link } from './link';
import { Transaction } from './transaction';

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

  @OneToMany(() => Transaction, transaction => transaction.sourceTokenInfo)
  transactions: Transaction[];

  @OneToMany(() => Link, link => link.destinationTokenInfo)
  links: Link[];
}
