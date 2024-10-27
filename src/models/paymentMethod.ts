import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Chain } from './chain';
import type { Relation } from 'typeorm';
import { Token } from './token';
import { User } from './user';

/**
* @name - PaymentMethod
* @description - This entity represents a user's preferred payment methods.
*/
@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn('increment')
  id: bigint;

  @ManyToOne('Chain', 'chain')
  @JoinColumn({ name: 'chainId' })
  chain: Relation<Chain>;

  @ManyToOne('Token', 'token')
  @JoinColumn({ name: 'tokenId' })
  token: Relation<Token>;

  @ManyToOne(() => User, (user) => user.paymentMethods)
  user: Relation<User>;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}