import type { Writable} from "svelte/store";
import { get, writable } from "svelte/store"
import type { Chat, Message } from "$lib/types";

export const Chats = writable([] as Chat[]);

export const loadChats = (chats : Chat[]) => {
    let parsedChats : Chat[] = [];
    chats.forEach(chat => {
        let messages : Message[] = [];
        chat.messages.forEach(message => {
            messages.push({
                id: Number(message.id),
                content: message.content,
                sender: message.sender,
                written_at: Number(message.written_at)
            })
        })

        parsedChats.push({
            id: Number(chat.id),
            messages: messages,
            newMessages: chat.newMessages,
            recipient: {name: chat.recipient.name}
        });
    });
    Chats.set(parsedChats);
}

export const addChat = (content : any) => {
    Chats.update((chats => [...chats, {
            id: Number(content.chatId),
            messages: [] as Message[],
            newMessages: 0,
            recipient: {name : content.userName}
        }]));
}

export const addMessage = (content : any) => {
    Chats.update((chats) => {
        let chat = chats.find(chat => chat.id === Number(content.chat_id))
        if(!chat) return;
        
        let message = {
            content: content.content,
            id: Number(content.id),
            sender: content.sender,
            written_at: Number(content.written_at)
        };

        if(typeof chat.messages === "number") return chats;

        chat.messages.unshift(message);
        chat.newMessages++;

        return chats;
    });
}

export const removeMessage = (content : any) => {
    Chats.update(chats => {
        let chat = chats.filter(chat => chat.id === Number(content.chatId))[0];
        chat.messages = chat.messages.filter(msg => msg.id !== Number(content.messageId))
        return chats;
    })
}