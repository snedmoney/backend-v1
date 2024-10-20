import {
  Column,
  CreateDateColumn,
  Relation,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Link } from './link';
import type { Wallet } from './wallet';
import type { TokenAccount } from './tokenAccount';

export enum StatusType {
  IN_PROGRESS = 'inProgress',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum TransactionType {
  TIP = 'tip',
  DONATION = 'donation',
  PAYMENT = 'payment',
  SWAP = 'swap',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  transactionType: TransactionType;

  @Column({
    type: 'enum',
    enum: StatusType,
  })
  statusType: StatusType;

  @Column()
  sourceTokenAmount: number;

  @Column()
  sourceTotalFiat: number;

  @Column()
  sourceTokenPriceFiat: number;

  @Column()
  feeInFiat: number;

  @Column()
  destinationTokenAmount: number;

  @Column()
  destinationTotalFiat: number;

  @Column()
  destinationTokenPriceFiat: number;

  @Column()
  transactionHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('Wallet', 'transactions')
  @JoinColumn({ name: 'sourceWalletAddress' })
  sourceWalletAddress: Relation<Wallet>;

  @ManyToOne('TokenAccount', 'transactions')
  sourceTokenInfo: Relation<TokenAccount>;

  @ManyToOne('Link', 'transactions')
  link: Relation<Link>;
}
