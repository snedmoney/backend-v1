import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import type { Link } from './link';
import { PaymentMethod } from './paymentMethod';
import type { Relation } from 'typeorm';
import { Social } from './social';
import { Wallet } from './wallet';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('increment')
    id: bigint;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
    userName: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    profileURI: string;

    @OneToMany(() => Wallet, (wallet) => wallet.user)
    wallets: Relation<Wallet[]>;

    @OneToMany(() => Social, (social) => social.user, { cascade: true })
    socials: Relation<Social[]>;

    @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.user, {
        cascade: true,
    })
    paymentMethods: Relation<PaymentMethod[]>;

    @Column({ type: 'varchar', length: 255, nullable: true })
    slogan: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    about: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    websiteLink: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany('Link', 'user')
    links: Relation<Link[]>;
}
