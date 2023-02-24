import {Entity, Column, PrimaryColumn} from "typeorm"

@Entity()
export class FriendList {
    @PrimaryColumn()
    idOne: number

    @PrimaryColumn()
    idTwo: number
}
