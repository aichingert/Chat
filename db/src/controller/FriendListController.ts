import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { FriendList } from "../entity/FriendList"

export class FriendListController {
    private userRepository = AppDataSource.getRepository(FriendList)

    async all(): Promise<FriendList[]> {
        return this.userRepository.find()
    }

    async one(idOne: number, idTwo): Promise<FriendList | string> {
        const friendList = await this.userRepository.findOne({
            where: { idOne, idTwo }
        })

        if (!friendList) {
            return "no such friend list"
        }
        return friendList
    }

    async save(friendList: FriendList) {
        return this.userRepository.save(friendList)
    }

    async remove(idOne: number, idTwo): Promise<string> {
        let userToRemove = await this.userRepository.findOneBy({ idOne, idTwo })

        if (!userToRemove) {
            return "Friend list does not exist"
        }

        await this.userRepository.remove(userToRemove)

        return "friend list has been removed"
    }

    //to be added friendList
}