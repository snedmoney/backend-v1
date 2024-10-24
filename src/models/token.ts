import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
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

  @Column({ nullable: true })
  popularityRank: number;

  @ManyToOne('Chain', 'tokens')
  @JoinColumn({ name: 'chainId' })
  chain: Relation<Chain>;

  @Column()
  chainId: number;
}