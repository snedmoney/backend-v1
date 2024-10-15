import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

    @Column()
    chainId: number;
}
