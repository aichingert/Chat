<script lang="ts">
	import { onMount } from "svelte";
    
    onMount(async() => {
        let raw = await fetch("http://127.0.0.1:3000/login", {
            method: "POST",
            headers: {

            },
            body: JSON.stringify({
                username: "test",
                password: await digestMessage("blyat")
            })
        });
        let response = await raw.json();
        console.log(response);
        sessionStorage.setItem("id", response.id);
    });


    
    async function digestMessage(message : string) {
        const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
        const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
        return hashHex;
    }

</script>

<div class="w-screen h-screen flex justify-center items-center">
    <div class="flex bg-onedark-darkblue rounded-xl w-1/2 h-1/2 text-center shadow-lg border-2 border-onedark-darkblue justify-center">
        <form class="grid grid-cols-2 space-4 w-2/3 justify-center items-center">
        </form>
    </div>
</div>