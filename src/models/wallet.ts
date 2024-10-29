import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Link } from './link';
import type { Relation } from 'typeorm';
import { User } from './user';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('increment')
  id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @ManyToOne(() => User, (user) => user.wallets, {
      cascade: true,
  })
  user: Relation<User>;

  @ManyToOne('Link', 'destinationWallet')
  links: Relation<Link[]>;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
