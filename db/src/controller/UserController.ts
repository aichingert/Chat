import { AppDataSource } from '../data-source';
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User"
import { QueryBuilder } from "typeorm";

export class UserController {
    private userRepository = AppDataSource.getRepository(User);

    async all(): Promise<User[]> {
        return this.userRepository.find();
    }

    async one(id: number): Promise<User | string> {
        const user = await this.userRepository.findOneBy({ id });

        if (!user) {
            return "unregistered user";
        }

        return user;
    }

    async get_one_by_name(name: string): Promise<User | string> {
        const user = this.userRepository
            .createQueryBuilder("user")
            .where("user.name = :name", { name: name })
            .getOne();

        if (!user) {
            return "unregistered user";
        }

        return user;
    }

    async save(user: User) {
        return this.userRepository.save(user);
    }

    async remove(id: number): Promise<string> {
        const userToRemove = await this.userRepository.findOneBy({ id });

        if (typeof userToRemove === "string") {
            return "User does not exist";
        }

        await this.userRepository.remove(userToRemove);
        return "user has been removed";
    }
}