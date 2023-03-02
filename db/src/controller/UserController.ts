import { AppDataSource } from '../data-source';
import { User } from "../entity/User"
import {Repository} from "typeorm";

export class UserController {
    private userRepository: Repository<User> = AppDataSource.getRepository(User);

    async all(): Promise<User[]> {
        return this.userRepository.find();
    }

    async one(id: number): Promise<User | string> {
        const user: User = await this.userRepository.findOneBy({ id });

        if (!user) {
            return "unregistered user";
        }

        return user;
    }

    async get_one_by_name(name: string): Promise<User | string> {
        const user: User = await this.userRepository
            .createQueryBuilder("user")
            .where("user.name = :name", { name: name })
            .getOne();

        if (!user) {
            return "unregistered user";
        }

        return user;
    }

    async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async remove(id: number): Promise<string> {
        const userToRemove: User | string = await this.userRepository.findOneBy({ id });

        if (typeof userToRemove === "string") {
            return "User does not exist";
        }

        await this.userRepository.remove(userToRemove);
        return "user has been removed";
    }

    async remove_all(): Promise<void> {
        const all: User[] = await this.userRepository.find();

        for (const user of all) {
            await this.remove(user.id);
        }
    }
}