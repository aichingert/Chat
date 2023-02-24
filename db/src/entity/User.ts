import { Hash } from "crypto"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar", nullable: false})
    firstName: string

    @Column({type: "varchar", nullable: false})
    lastName: string

    @Column({type: "integer", nullable: false})
    age: number

    @Column({type: "varchar", nullable: false})
    password: string
}
