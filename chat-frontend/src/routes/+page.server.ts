import type { PageServerLoad } from "./$types"
import type { User, Chat, Message } from "$lib/types"

export const load : PageServerLoad = (async({cookies}) => {
    let id = cookies.get("id");

    let chats : Chat[] = [];
    let messages: Message[] = [];
    for(let i = 0; i < 30; i++){
        messages.push({
            sender: {name:"e"},
            text:"text"
        })
    }


    for(let i = 0; i < 30; i++){
        chats.push({
            messages: messages,
            recipient: {name: `${i}`}
        })
    }


    let user : User = {} as User;
    // do request
    return {
        user: user,
        chats: chats,
    }
});