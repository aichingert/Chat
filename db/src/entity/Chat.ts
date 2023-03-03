import {Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column} from "typeorm"
import {User} from "./User";

@Entity()
export class Chat {

    @PrimaryGeneratedColumn({type: "integer"})
    id: number;

    @Column({type: "integer", nullable: false})
    new: number;

    @Column({type: "integer", nullable: false})
    user1_id: number;

    @Column({type: "integer", nullable: false})
    user2_id: number;


    @ManyToOne(() => User)
    @JoinColumn({ name: 'user1_id' })
    public user1: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user2_id' })
    public user2: User;
}