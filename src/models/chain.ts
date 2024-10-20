import {
    Entity,
    Column,
    OneToMany,
    Relation,
    PrimaryColumn,
  } from 'typeorm';
  import type { TokenAccount } from './tokenAccount';
  
  @Entity()
  export class ChainInfo {
    @PrimaryColumn()
    networkId: number;
  
    @Column()
    name: string;
  
    @Column()
    allowed: boolean;
  
    @Column({ nullable: true })
    iconURL: string;
  
    @Column({ type: 'json' })
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
  
    @Column({ nullable: true })
    explorerURL: string;
  
    @OneToMany('TokenAccount', 'chainInfo')
    tokenAccounts: Relation<TokenAccount[]>;
  }
  