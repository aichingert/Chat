import type { PageServerLoad } from "./$types"

export const load : PageServerLoad = (async({cookies}) => {
    let id = cookies.get("id");
    // do request
    return {
        id
    }
});