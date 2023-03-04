import type { PageServerLoad } from "./$types"
import type { User, Chat, Message } from "$lib/types"
import { redirect } from "@sveltejs/kit";

export const load : PageServerLoad = (async({cookies}) => {
    let id = cookies.get("id");

    if(!id) throw redirect(307, "/auth/login");

    id = 4;

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

    for(const chat of chatsFromDB){
        chat.messages.reverse();
    }

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