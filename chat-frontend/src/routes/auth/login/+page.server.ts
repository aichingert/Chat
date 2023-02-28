import { redirect } from "@sveltejs/kit";
import type {Actions, PageServerLoad} from "./$types"
import { digestMessage } from "$lib/hash";

const emptyHash = digestMessage("");

export const actions : Actions = {
    login: async(event) => {
        let data = await event.request.formData();
        let username = data.get("username") as string;
        let password = await digestMessage(data.get("password") as string);
        
        console.log(username);
        console.log(password);

        try{
            let raw = await fetch("http://127.0.0.1:3000/login", {
                method: "POST",
                body: JSON.stringify({
                    name: username,
                    password: password
                })
            });
            if(!raw.ok) return;
            let response = await raw.json();
            event.cookies.set("id", response.id, {
                maxAge: 60*60*24,
                secure: true,
                path:"/",
            });
            throw redirect(raw.status, "/");
        }
        catch{

        }
    }
};