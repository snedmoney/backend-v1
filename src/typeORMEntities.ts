import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { generateStringId } from '@/util/unique-id';

// Enums
export enum LinkType {
    TIP = 'tip',
    DONATION = 'donation',
    PAYMENT = 'payment'
}

export enum StatusType {
    IN_PROGRESS = 'inProgress',
    SUCCESS = 'success',
    FAILED = 'failed'
}

export enum TransactionType {
    TIP = 'tip',
    DONATION = 'donation',
    PAYMENT = 'payment',
    SWAP = 'swap'
}

// Link Entity
@Entity()
export class Link {
    @PrimaryColumn({ type: 'varchar', length: 10 })
    id: string;

    @BeforeInsert()
    generateId() {
        this.id = generateStringId();
    }

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: LinkType
    })
    type: LinkType;

    @ManyToOne(() => TokenAccount, tokenAccount => tokenAccount.links)
    destinationTokenInfo: TokenAccount;

    @ManyToOne(() => Wallet, wallet => wallet.links)
    @JoinColumn({ name: 'destinationWalletAddress' })
    destinationWallet: Wallet;

    @OneToMany(() => Transaction, transaction => transaction.link)
    transactions: Transaction[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

// TokenAccount Entity
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

    @OneToMany(() => Transaction, transaction => transaction.sourceTokenInfo)
    transactions: Transaction[];

    @OneToMany(() => Link, link => link.destinationTokenInfo)
    links: Link[];
}

// Transaction Entity
@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: TransactionType
    })
    transactionType: TransactionType;

    @Column({
        type: 'enum',
        enum: StatusType
    })
    statusType: StatusType;

    @Column()
    sourceTokenAmount: number;

    @Column()
    sourceTotalFiat: number;

    @Column()
    sourceTokenPriceFiat: number;

    @Column()
    feeInFiat: number;

    @Column()
    destinationTokenAmount: number;

    @Column()
    destinationTotalFiat: number;

    @Column()
    destinationTokenPriceFiat: number;

    @Column()
    transactionHash: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Wallet, wallet => wallet.transactions)
    @JoinColumn({ name: 'sourceWalletAddress' })
    sourceWalletAddress: Wallet;

    @ManyToOne(() => TokenAccount, tokenAccount => tokenAccount.transactions)
    sourceTokenInfo: TokenAccount;

    @ManyToOne(() => Link, link => link.transactions)
    link: Link;
}

// Wallet Entity
@Entity()
export class Wallet {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    walletAddress: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    userName: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    twitter: string;

    @Column({ nullable: true })
    facebook: string;

    @Column({ nullable: true })
    tiktok: string;

    @Column({ nullable: true })
    youtube: string;

    @Column({ nullable: true })
    twitch: string;

    @Column({ nullable: true })
    instagram: string;

    @Column({ nullable: true })
    threads: string;

    @Column({ nullable: true })
    discord: string;

    @Column({ nullable: true })
    telegram: string;

    @Column({ nullable: true })
    link1: string;

    @Column({ nullable: true })
    link2: string;

    @OneToMany(() => Transaction, transaction => transaction.sourceWalletAddress)
    transactions: Transaction[];

    @OneToMany(() => Link, link => link.destinationWallet)
    links: Link[];
}