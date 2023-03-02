import { redirect } from "@sveltejs/kit";
import type {Actions, PageServerLoad} from "./$types"
import { digestMessage } from "$lib/hash";

export const actions : Actions = {
    register: async(event) => {
        let data = await event.request.formData();
        let username = data.get("username") as string;
        let password = await digestMessage(data.get("password") as string);

        let raw = await fetch("http://127.0.0.1:3000/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: username,
                password: password
            })
        });

        if(raw.status != 201) return;
        let response = await raw.text();
        event.cookies.set("id", response, {
            maxAge: 60*60*24,
            secure: true,
            path:"/",
        });
        throw redirect(300, "/");
    }
};

export const load : PageServerLoad = (async({cookies}) => {
    return {

    }
});
