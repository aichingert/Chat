<script lang="ts">
	import { onMount } from "svelte";
	import type { PageData } from "./$types";

    $: connection = true;
    onMount(() => {
        connection = window.navigator.onLine;
        window.addEventListener("online", () => connection = true);
        window.addEventListener("offline", () => connection = false);
        console.log(data);
    });

    export let data : PageData;


</script>

<div class="grid grid-cols-6 h-screen">
    <div class="col-span-2 border-r-4 border-onedark-darkblue h-screen">
        <div class="">
            <div class="py-2 flex items-center bg-onedark-gray px-2 space-x-2">
                <div class="rounded-full h-5 w-5 {connection ? "bg-onedark-green" : "bg-onedark-red"}"/>
                <p class="md:text-lg text-xs">
                    Luka Civic
                </p>
            </div>
            <div class="py-2 flex items-center bg-onedark-darkblue px-2">
                <form class="flex items-center bg-onedark-gray w-full px-2 rounded-md">
                    <button class="px-2 flex justify-center" type="submit">
                        <svg class="fill-onedark-white" height="24" viewBox="0 96 960 960" width="24"><path d="M784 936 532 684q-30 24-69 38t-83 14q-109 0-184.5-75.5T120 476q0-109 75.5-184.5T380 216q109 0 184.5 75.5T640 476q0 44-14 83t-38 69l252 252-56 56ZM380 656q75 0 127.5-52.5T560 476q0-75-52.5-127.5T380 296q-75 0-127.5 52.5T200 476q0 75 52.5 127.5T380 656Z"/></svg>
                    </button>
                    <input name="search" placeholder="search chats" class="placeholder-onedark-lightgray outline-none bg-inherit w-11/12">
                </form>
            </div>
            <div>

            </div>
        </div>  
    </div>
    <div class="col-span-4 h-screen">

    </div>
</div>