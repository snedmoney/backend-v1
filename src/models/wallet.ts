import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

import { Link } from "./link";
import { Transaction } from './transaction';

@Entity()
export class Wallet {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  walletAddress: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  userName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  tiktok: string;

  @Column({ nullable: true })
  youtube: string;

  @Column({ nullable: true })
  twitch: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  threads: string;

  @Column({ nullable: true })
  discord: string;

  @Column({ nullable: true })
  telegram: string;

  @Column({ nullable: true })
  link1: string;

  @Column({ nullable: true })
  link2: string;

  @OneToMany(() => Transaction, transaction => transaction.sourceWalletAddress)
  transactions: Transaction[];

  @OneToMany(() => Link, link => link.destinationWallet)
  links: Link[];
}
