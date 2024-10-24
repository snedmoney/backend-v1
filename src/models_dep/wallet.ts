import {
  PrimaryColumn,
  OneToMany,
  Entity,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { Transaction } from './transaction';
import type { Link } from './link';
import type { Setting } from './setting';

export enum UserRole {
  CREATOR = 'creator',
  FOLLOWER = 'follower',
}

@Entity()
export class Wallet {
  @PrimaryColumn({ type: 'varchar', length: 255, unique: true })
  walletAddress: string;

  @Column({
      type: 'enum',
      enum: UserRole,
  })
  role: UserRole;

  @OneToMany('Transaction', 'sourceWalletAddress')
  transactions: Relation<Transaction[]>;

  @OneToMany('Link', 'destinationWallet')
  links: Relation<Link[]>;

  @OneToOne('Setting', 'wallet', { cascade: true })
  setting: Relation<Setting>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}