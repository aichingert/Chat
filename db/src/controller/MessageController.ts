import { AppDataSource } from '../data-source'
import { Message } from "../entity/Message"

export class MessageController {
    private messageRepository = AppDataSource.getRepository(Message)

    async all(): Promise<Message[]> {
        return this.messageRepository.find()
    }

    async one(id: number): Promise<Message | string> {
        const chat = await this.messageRepository.findOne({
            where: { id }
        })

        if (!chat) {
            return "no chat"
        }
        return chat
    }

    async save(message: Message) {
        return this.messageRepository.save(message)
    }

    async remove(id: number): Promise<string> {
        let messageToRemove = await this.messageRepository.findOneBy({ id })

        if (!messageToRemove) {
            return "Message does not exist"
        }

        await this.messageRepository.remove(messageToRemove)

        return "Message has been removed"
    }
}