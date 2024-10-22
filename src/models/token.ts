import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Chain } from './chain';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column('numeric')
  decimals: number;

  @Column()
  address: string;

  @Column()
  logoURI: string;

  @ManyToOne('Chain', 'tokens')
  chain: Relation<Chain>;
}