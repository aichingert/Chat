import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm"
import {Chat} from "./Chat";
import {User} from "./User";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar", nullable: false})
    content: string;

    @Column({type: "bigint", nullable: false})
    written_at: number;

    @Column()
    chat_id: number;

    @Column()
    user_id: number;


    @ManyToOne(() => Chat)
    @JoinColumn({ name: 'chat_id' })

    chat: Chat;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })

    user: User;
}
