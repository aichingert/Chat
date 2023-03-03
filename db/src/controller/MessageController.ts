import { AppDataSource } from '../data-source'
import { Message } from "../entity/Message"
import {Repository} from "typeorm";

export class MessageController {
    private messageRepository: Repository<Message> = AppDataSource.getRepository(Message);

    async all(): Promise<Message[]> {
        return this.messageRepository.find();
    }

    async one(id: number): Promise<Message | string> {
        const message: Message = await this.messageRepository.findOneBy( { id });

        if (!message) {
            return "no message";
        }
        return message;
    }

    async getMessagesFrom(chatId: number): Promise<Message[] | string> {
        const messages: Message[] = await this.messageRepository
            .createQueryBuilder("message")
            .where("message.chat_id = :id", { id: chatId })
            .getMany();

        if (!messages) {
            return "Invalid chat";
        }

        return messages;
    }

    async save(message: Message): Promise<Message> {
        return this.messageRepository.save(message);
    }

    async remove(id: number): Promise<string> {
        let messageToRemove: Message = await this.messageRepository.findOneBy({ id });

        if (!messageToRemove) {
            return "Message does not exist";
        }

        await this.messageRepository.remove(messageToRemove);
        return "Message has been removed";
    }

    async removeAll(): Promise<void> {
        const all: Message[] = await this.messageRepository.find();

        for (const message of all) {
            await this.remove(message.id);
        }
    }
}