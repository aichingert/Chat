import { redirect } from "@sveltejs/kit";
import type {Actions, PageServerLoad} from "./$types"
import { digestMessage } from "$lib/hash";

const emptyHash = digestMessage("");

export const actions : Actions = {
    login: async({request, cookies, fetch}) => {
        let data = await request.formData();
        let username = data.get("username") as string;
        username = username.trim();
        let password = data.get("password") as string;
        password = password.trim();

        if(username.length === 0) return;
        if(password.length === 0) return;

        password = await digestMessage(password);

        
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
        cookies.set("id", response, {
            maxAge: 60*60*24,
            secure: false,
            path:"/",
        });
        throw redirect(300, "/");
    }
};