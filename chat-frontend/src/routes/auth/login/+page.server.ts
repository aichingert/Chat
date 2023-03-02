import { redirect } from "@sveltejs/kit";
import type {Actions, PageServerLoad} from "./$types"
import { digestMessage } from "$lib/hash";

const emptyHash = digestMessage("");

export const actions : Actions = {
    login: async(event) => {
        let data = await event.request.formData();
        let username = data.get("username") as string;
        let password = await digestMessage(data.get("password") as string);
        
        let raw = await fetch("http://127.0.0.1:3000/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: username,
                password: password
            })
        });
        if(raw.status != 302) return;   
        let response = await raw.text();
        event.cookies.set("id", response, {
            maxAge: 60*60*24,
            secure: true,
            path:"/",
        });
        throw redirect(300, "/");
    }
};