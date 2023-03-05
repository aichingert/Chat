import type { PageServerLoad } from "./$types"
import type { User, Chat, Message } from "$lib/types"
import { redirect, type Actions } from "@sveltejs/kit";

export const load : PageServerLoad = (async({cookies}) => {
    let id = cookies.get("id");

    if(!id) throw redirect(307, "/auth/login");

    let raw = await fetch("http://127.0.0.1:3000/user/chats", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id:id
        })
    });

    const chatsFromDB : Chat[] = await raw.json();

    let chats : Chat[] = [];


    for(const chatFromDB of chatsFromDB){
        let chat : Chat = {
            id : chatFromDB.id,
            messages: chatFromDB.messages.reverse().forEach(message => message.written_at = Number(message.written_at)),
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

    // do request
    return {
        user: user,
        chats: chatsFromDB,
    }
});


export const actions : Actions = {
    add: async(event) => {
        const formData = await event.request.formData();
        const chatUserName = await formData.get("chat") as string;

        console.log(event.cookies.get("id"))

        fetch("http://127.0.0.1:3000/chats", {
            method:"PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                abdul: event.cookies.get("id"),
                bertl: chatUserName
            })
        })
    }
}