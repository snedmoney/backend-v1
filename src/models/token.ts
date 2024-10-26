import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { Chain } from './chain';
import type { Link } from './link';

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

  @ManyToOne('Link', 'id')
  links: Relation<Link[]>;

  @Column()
  chainId: number;
}