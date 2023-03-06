import type { PageServerLoad } from "./$types"
import type { User, Chat, Message } from "$lib/types"
import { redirect, type Actions } from "@sveltejs/kit";

export const load : PageServerLoad = (async({cookies}) => {
    let id = cookies.get("id");

    if(!id) throw redirect(307, "/auth/login");

    let raw;
    try{
        raw = await fetch("http://127.0.0.1:3000/user/chats", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id:id
            })
        });
    }
    catch{
        throw redirect(307, "/auth/login");
    }


    const chatsFromDB : Chat[] = await raw.json();

    let chats : Chat[] = [];


    for(const chatFromDB of chatsFromDB){
        let chat : Chat = {
            id : chatFromDB.id,
            messages: chatFromDB.messages.reverse().forEach(message => {
                message.written_at = Number(message.written_at);
                message.id = Number(message.id);
            }),
            newMessages: chatFromDB.newMessages,
        };
    }

    raw = await fetch("http://127.0.0.1:3000/user", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id:id
        })
    })

    const userFromDB = await raw.json();


    let user : User = {
        id: Number(id),
        name: userFromDB.name
    }

    return {
        user: user,
        chats: chatsFromDB,
    }
});


export const actions : Actions = {
    add: async(event) => {
        const formData = await event.request.formData();
        const chatUserName = await formData.get("chat") as string;

        await fetch("http://127.0.0.1:3000/chats", {
            method:"PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                abdul: event.cookies.get("id"),
                bertl: chatUserName
            })
        })
    },

    logout: async(event) => {
        await fetch("http://127.0.0.1:3000/logout", {
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: event.cookies.get("id")
            })
        });

        event.cookies.delete("id", {
            path: "/"
        });

        throw redirect(300, "/auth/login")
    },

    removeMessage: async(event) => {
        await fetch(`http://127.0.0.1/messages/${event.params.messageId}`, {
            method: "DELETE",
        });
    },

    addMessage: async(event) => {
        let chatId = event.url.searchParams.get("id");
        let content = (await event.request.formData()).get("message") as string;

        console.log(chatId);
        console.log(content)

        let aw = await fetch(`http://127.0.0.1:3000/chats/${chatId}/message`, {
            method:"PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                user_id: event.cookies.get("id"),
                content: content,
                written_at: Date.now()
            })
        });
    }
}