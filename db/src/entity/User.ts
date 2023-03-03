import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn({type: "integer"})
    id: number

    @Column({type: "varchar", nullable: false})
    name: string

    @Column({type: "varchar", nullable: false})
    password: string
}