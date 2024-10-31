import {
    Entity,
    Column,
    OneToMany,
    PrimaryColumn,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { Token } from './token';
import { Chain } from './chain';
import { Wallet } from './wallet';
import { Link } from './link';
import { User } from './user';

export enum TransactionType {
    DONATION = 'donation',
    TIP = 'tip',
    PAYMENT = 'payment',
}

export enum TransactionStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

@Entity()
export class Transaction {
    @PrimaryColumn()
    id: string;

    @Column({
        type: 'enum',
        enum: TransactionType,
    })
    type: TransactionType;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
    })
    status: TransactionStatus;

    @Column({ type: 'float', nullable: true })
    sourceTokenAmount: number;

    @Column({ type: 'float', nullable: true })
    sourceTotalFiat: number;

    @Column({ type: 'float', nullable: true })
    feeInFiat: number;

    @Column({ type: 'float', nullable: true })
    destinationTokenAmount: number;

    @Column({ type: 'float', nullable: true })
    destinationTokenFiat: number;

    @Column({ type: 'float', nullable: true })
    destinationTokenPriceFiat: number;

    @Column({ nullable: true })
    transactionHash: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany('Token', 'id')
    @JoinColumn({ name: 'id' })
    sourceTokenId: Relation<Token>;

    @OneToMany('Token', 'id')
    @JoinColumn({ name: 'id' })
    destinationTokenId: Relation<Token>;

    @OneToMany('Chain', 'id')
    @JoinColumn({ name: 'id' })
    sourceChainId: Relation<Chain>;

    @OneToMany('Chain', 'id')
    @JoinColumn({ name: 'id' })
    destinationChainId: Relation<Chain>;

    @OneToMany('Wallet', 'id')
    @JoinColumn({ name: 'id' })
    walletId: Relation<Wallet>;

    @ManyToOne('Link', 'transactions')
    linkId: Relation<Link>;

    @OneToMany('User', 'id')
    user: Relation<User>;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    message: string;
}
