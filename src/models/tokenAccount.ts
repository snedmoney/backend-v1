import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TokenAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tokenAddress: string;

  @Column()
  chainId: number;

  @Column()
  chainName: string;

  @Column()
  decimals: number;

  @Column()
  logoURI: string;

  @Column()
  name: string;

  @Column()
  symbol: string;
}
