import { AppDataSource } from '../data-source';
import { Chat } from "../entity/Chat";
import {Repository} from "typeorm";

export class ChatController {
    private chatRepository: Repository<Chat> = AppDataSource.getRepository(Chat);

    async all(): Promise<Chat[]> {
        return this.chatRepository.find();
    }

    async one(id: number): Promise<Chat | string> {
        const chat: Chat = await this.chatRepository.findOneBy({ id });

        if (!chat) {
            return "no chat";
        }

        return chat;
    }

    async get_user_chats(id: number): Promise<Chat[] | string> {
        const chats: Chat[] = await this.chatRepository
            .createQueryBuilder("chat")
            .where("chat.user1_id = :u1_id", { u1_id: id })
            .orWhere("chat.user2_id = :u2_id", { u2_id: id })
            .getMany();

        if (!chats) {
            return "Return no chats!";
        }

        return chats;
    }

    async save(chat: Chat): Promise<Chat> {
        return this.chatRepository.save(chat);
    }

    async remove(id: number): Promise<string> {
        let chatToRemove: Chat = await this.chatRepository.findOneBy({ id });

        if (!chatToRemove) {
            return "Chat does not exist";
        }

        await this.chatRepository.remove(chatToRemove);
        return "Chat has been removed";
    }

    async remove_all(): Promise<void> {
        const all: Chat[] = await this.chatRepository.find();

        for (const chat of all) {
            await this.remove(chat.id);
        }
    }
}