import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany} from "typeorm"
import {Message} from "./Message";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar", nullable: false})
    name: string

    @Column({type: "varchar", nullable: false})
    password: string
}
