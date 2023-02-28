import { redirect } from "@sveltejs/kit";
import type {Actions, PageServerLoad} from "./$types"
import { digestMessage } from "$lib/hash";

export const actions : Actions = {
    register: async(event) => {
        let data = await event.request.formData();
        let username = data.get("username") as string;
        let password = await digestMessage(data.get("password") as string);
    
        console.log(username);
        console.log(password);

        try{
            let raw = await fetch("http://127.0.0.1:3000/register", {
                method: "POST",
                body: JSON.stringify({
                    name: username,
                    password: password
                })
            });
        }
        catch{

        }
    }
};

export const load : PageServerLoad = (async({cookies}) => {
    return {

    }
});
