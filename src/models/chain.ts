import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import type { Link } from './link';
import { PaymentMethod } from './paymentMethod';
import type { Relation } from 'typeorm';
import type { Token } from './token';

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

    @OneToMany('PaymentMethod', 'chain')
    paymentMethods: Relation<PaymentMethod[]>;
}
