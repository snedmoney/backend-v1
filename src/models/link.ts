import { generateStringId } from '@/util/unique-id';
import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
    BeforeInsert,
    OneToMany,
} from 'typeorm';
import { TokenAccount } from './tokenAccount';

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

    @Column()
    address: string;

    @OneToMany(() => TokenAccount, (tokenAccount) => tokenAccount.link, {
        cascade: true,
    })
    acceptedTokens: TokenAccount[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
