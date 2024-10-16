import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Link } from "./link";
import { TokenAccount } from "./tokenAccount";
import { Wallet } from './wallet';

export enum StatusType {
  IN_PROGRESS = 'inProgress',
  SUCCESS = 'success',
  FAILED = 'failed'
}

export enum TransactionType {
  TIP = 'tip',
  DONATION = 'donation',
  PAYMENT = 'payment',
  SWAP = 'swap'
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TransactionType
  })
  transactionType: TransactionType;

  @Column({
    type: 'enum',
    enum: StatusType
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

  @ManyToOne(() => Wallet, wallet => wallet.transactions)
  @JoinColumn({ name: 'sourceWalletAddress' })
  sourceWalletAddress: Wallet;

  @ManyToOne(() => TokenAccount, tokenAccount => tokenAccount.transactions)
  sourceTokenInfo: TokenAccount;

  @ManyToOne(() => Link, link => link.transactions)
  link: Link;
}
