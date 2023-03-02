import { Hash } from "crypto"
import {Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column, OneToMany} from "typeorm"
import {User} from "./User";
import {Message} from "./Message";

@Entity()
export class Chat {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user1_id: number;

    @Column()
    user2_id: number;


    @ManyToOne(() => User)
    @JoinColumn({ name: 'user1_id' })
    public user1: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user2_id' })
    public user2: User;
}