import { Entity, Column } from "typeorm"

@Entity()
export class FriendList {

    @Column()
    idOne: number

    @Column()
    idTwo: number
}
