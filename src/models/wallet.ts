import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn
} from 'typeorm';

import type { User } from './user';

@Entity('wallet')
export class Wallet {
  @PrimaryGeneratedColumn('increment')
  id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @ManyToOne('User', 'user')
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}