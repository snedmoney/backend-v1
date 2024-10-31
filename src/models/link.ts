import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Chain } from './chain';
import type { Relation } from 'typeorm';
import type { Token } from './token';
import type { User } from './user';
import type { Wallet } from './wallet';
import { Transaction } from './transaction';

export enum LinkType {
    DONATION = 'donation',
    PROFILE = 'profile',
    PAYMENT = 'payment',
}

@Entity()
export class Link {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    title: string;

    @Column({
        type: 'enum',
        enum: LinkType,
    })
    type: LinkType;

    @Column()
    description: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // Payment and Tip type does not need acceptUntil
    @CreateDateColumn({ type: 'timestamp', nullable: true })
    acceptUntil: Date;

    // Payemnt and Tip type does not need goalAmount
    @Column({ type: 'float', nullable: true })
    goalAmount: number;

    @ManyToOne('Token', 'links', { cascade: true })
    destinationToken: Relation<Token>;

    @ManyToOne('Chain', 'links', { cascade: true })
    destinationChain: Relation<Chain>;

    @ManyToOne('Wallet', 'links', { cascade: true })
    destinationWallet: Relation<Wallet>;

    @ManyToOne('User', 'links', { cascade: true })
    user: Relation<User>;

    @OneToMany('Transaction', 'linkId', { cascade: true })
    transactions: Relation<Transaction[]>;
}
