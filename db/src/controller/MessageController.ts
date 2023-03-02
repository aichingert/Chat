import { AppDataSource } from '../data-source'
import { Message } from "../entity/Message"

export class MessageController {
    private messageRepository = AppDataSource.getRepository(Message);

    async all(): Promise<Message[]> {
        return this.messageRepository.find();
    }

    async one(id: number): Promise<Message | string> {
        const chat: Message = await this.messageRepository.findOneBy( { id });

        if (!chat) {
            return "no chat";
        }
        return chat;
    }

    async get_messages_from(chat_id: number): Promise<Message[] | string> {
        const messages: Message[] = await this.messageRepository
            .createQueryBuilder("message")
            .where("message.chat_id = :id", { id: chat_id })
            .getMany();

        if (!messages) {
            return "Invalid chat";
        }

        return messages;
    }

    async save(message: Message) {
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
}