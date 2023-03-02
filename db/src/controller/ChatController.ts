import { AppDataSource } from '../data-source';
import { Chat } from "../entity/Chat";
import { UserController } from "./UserController";

export class ChatController {
    private chatRepository = AppDataSource.getRepository(Chat)
    private userController = new UserController();

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

    async user_chats(name: string): Promise<Chat[]> {
        let user = await this.userController.one_by_name(name);

        if (typeof user === "string") {
            return [];
        }

        const user1_id = user.id;
        const user2_id = user.id;
        let query_one = await this.chatRepository.findBy( { user1_id });
        let query_two = await this.chatRepository.findBy( { user2_id });

        return query_one.concat(query_two);
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
}