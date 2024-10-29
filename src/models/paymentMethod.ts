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
import type { User } from './user';

/**
* @name - PaymentMethod
* @description - This entity represents a user's preferred payment methods.
*/
@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn('increment')
  id: bigint;

  @ManyToOne('Chain', 'paymentMethods', { cascade: true })
  chain: Relation<Chain>;

  @ManyToOne('Token', 'paymentMethods')
  token: Relation<Token>;

  @ManyToOne('User', 'paymentMethods')
  user: Relation<User>;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
