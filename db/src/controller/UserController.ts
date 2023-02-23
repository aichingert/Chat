import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"

export class UserController {
    private userRepository = AppDataSource.getRepository(User)

    async all(): Promise<User[]> {
        return this.userRepository.find()
    }

    async one(id: number): Promise<User | string> {
        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            return "unregistered user"
        }
        return user
    }

    async create(input: Partial<User>) {
        return await this.userRepository.save(this.userRepository.create(input));
    }

    async save(user: User) {
        return this.userRepository.save(user)
    }

    async remove(id: number): Promise<string> {
        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            return "User does not exist"
        }

        await this.userRepository.remove(userToRemove)

        return "user has been removed"
    }

    //to be added friendList 
}