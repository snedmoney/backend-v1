import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { Link } from './link';
import { PaymentMethod } from './paymentMethod';
import type { Relation } from 'typeorm';
import { Social } from './social';
import type { Wallet } from './wallet';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profileURI: string;

  @OneToMany('Wallet', 'user')
  wallets: Relation<Wallet[]>;

  @OneToMany('Social', 'user', {
      cascade: true,
  })
  socials: Relation<Social[]>;

  @OneToMany('PaymentMethod', 'user', {
      cascade: true,
  })
  paymentMethods: Relation<PaymentMethod[]>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slogan: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  about: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  websiteLink: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany('Link', 'user')
  links: Relation<Link[]>;
}