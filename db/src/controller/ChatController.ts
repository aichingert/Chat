import { AppDataSource } from '../data-source'
import { Chat } from "../entity/Chat"

export class ChatController {
    private chatRepository = AppDataSource.getRepository(Chat)

    async all(): Promise<Chat[]> {
        return this.chatRepository.find()
    }

    async one(id: number): Promise<Chat | string> {
        const chat = await this.chatRepository.findOne({
            where: { id }
        })

        if (!chat) {
            return "no chat"
        }
        return chat
    }

    async save(chat: Chat) {
        return this.chatRepository.save(chat)
    }

    async remove(id: number): Promise<string> {
        let chatToRemove = await this.chatRepository.findOneBy({ id })

        if (!chatToRemove) {
            return "Chat does not exist"
        }

        await this.chatRepository.remove(chatToRemove)

        return "Chat has been removed"
    }

    //to be added friendList
}