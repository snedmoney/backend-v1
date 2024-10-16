import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Link } from './link'; // adjust the path as necessary
@Entity()
export class TokenAccount {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    address: string;
    @Column()
    chainId: number;
    @Column()
    token: string;
    @ManyToOne(() => Link, (link) => link.acceptedTokens)
    link: Link;
}
