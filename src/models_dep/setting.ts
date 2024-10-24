import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { Wallet } from './wallet';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToOne('Wallet', 'setting')
  @JoinColumn({ name: 'walletAddress' })
  wallet: Relation<Wallet>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}