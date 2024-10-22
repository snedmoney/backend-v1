import { generateStringId } from '@/util/unique-id';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TokenAccount } from './tokenAccount';
import { Wallet } from './wallet';
import { Transaction } from './transaction';

export enum LinkType {
  TIP = 'tip',
  DONATION = 'donation',
  PAYMENT = 'payment',
}

@Entity()
export class Link {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = generateStringId();
  }

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: LinkType,
  })
  type: LinkType;

  @ManyToOne(() => TokenAccount, (tokenAccount) => tokenAccount.links)
  destinationTokenInfo: TokenAccount;

  @ManyToOne(() => Wallet, (wallet) => wallet.links)
  @JoinColumn({ name: 'destinationWalletAddress' })
  destinationWallet: Wallet;

  @OneToMany(() => Transaction, (transaction) => transaction.link)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
