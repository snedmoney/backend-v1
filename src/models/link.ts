import {
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { Token } from './token';
import { Chain } from './chain';
import { Wallet } from './wallet';

export enum LinkType {
  DONATION = 'donation',
  TIP = 'tip',
  PAYMENT = 'payment',
}

@Entity()
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
      type: 'enum',
      enum: LinkType,
  })
  type: LinkType;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Payment and Tip type does not need acceptUntil
  @CreateDateColumn({ type: 'timestamp', nullable: true })
  acceptUntil: Date;

  // Payemnt and Tip type does not need goalAmount
  @Column({ type: 'float', nullable: true })
  goalAmount: number;

  @ManyToOne('Token', 'links', { cascade: true })
  destinationToken: Relation<Token>;

  @ManyToOne('Chain', 'links', { cascade: true })
  destinationChain: Relation<Chain>;

  @OneToMany('Wallet', 'id', { cascade: true })
  @JoinColumn({ name: 'id' })
  destinationWallet: Relation<Wallet>;
}