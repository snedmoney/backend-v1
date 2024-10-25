import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import type { Token } from './token';
import type { Link } from './link';

@Entity()
export class Chain {
    // Do not auto increment this, chain IDs are universally unique
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    allowed: boolean;

    @Column({ nullable: true })
    iconURL: string;

    @Column({ type: 'jsonb', nullable: true })
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };

    @Column({ nullable: true })
    explorerURL: string;

    @OneToMany('Token', 'chain')
    tokens: Relation<Token[]>;

    @OneToMany('Link', 'destinationChain')
    links: Relation<Link[]>;
}