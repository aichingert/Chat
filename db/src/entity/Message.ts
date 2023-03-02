import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm"
import {Chat} from "./Chat";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar", nullable: false})
    content: string;

    @Column({type: "bigint", nullable: false})
    written: number;

    @Column()
    chat_id: number;

    @ManyToOne(() => Chat)
    @JoinColumn({ name: 'chat_id' })

    chat: Chat;
}
