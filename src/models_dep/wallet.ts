import { PrimaryColumn, OneToMany, Entity, Column, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Transaction } from './transaction';
import { Link } from "./link";
import { Setting } from "./setting";

export enum UserRole {
  CREATOR = 'creator',
  FOLLOWER = 'follower'
}

@Entity()
export class Wallet {
  @PrimaryColumn({ type: 'varchar', length: 255, unique: true })
  walletAddress: string;

  @Column({
    type: 'enum',
    enum: UserRole
  })
  role: UserRole;

  @OneToMany(() => Transaction, transaction => transaction.sourceWalletAddress)
  transactions: Transaction[];

  @OneToMany(() => Link, link => link.destinationWallet)
  links: Link[];

  @OneToOne(() => Setting, setting => setting.wallet, { cascade: true })
  setting: Setting;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}