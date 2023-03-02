<script lang="ts">
    import type { Chat } from "$lib/types";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";

    export let data : PageData;
    let chats = data.chats;

    let currentChat : Chat;
    $: currentChat;
    let socket;
    $: connection = true;
    onMount(() => {
        //socket = new WebSocket(`https://127.0.0.1:42069?client&id=${sessionStorage.getItem("id")}`);
        connection = window.navigator.onLine;
        window.addEventListener("online", () => connection = true);
        window.addEventListener("offline", () => connection = false);
        console.log(data)
    });
</script>

<div class="grid grid-cols-6 h-screen">
    <div class="col-span-1 border-r-4 border-onedark-darkblue h-screen">
        <div class="h-screen">
            <div class="h-10 flex items-center bg-onedark-gray px-2 space-x-2">
                <div class="rounded-full h-5 w-5 {connection ? "bg-onedark-green" : "bg-onedark-red"}"/>
                <p class="md:text-lg text-xs">
                    Luka Civic
                </p>
            </div>
            <div class="h-10 py-2 flex items-center bg-onedark-darkblue px-2">
                <form class="flex items-center bg-onedark-gray w-full px-2 rounded-md">
                    <button class="px-2 flex justify-center" type="submit">
                        <svg class="fill-onedark-white" height="24" viewBox="0 96 960 960" width="24"><path d="M784 936 532 684q-30 24-69 38t-83 14q-109 0-184.5-75.5T120 476q0-109 75.5-184.5T380 216q109 0 184.5 75.5T640 476q0 44-14 83t-38 69l252 252-56 56ZM380 656q75 0 127.5-52.5T560 476q0-75-52.5-127.5T380 296q-75 0-127.5 52.5T200 476q0 75 52.5 127.5T380 656Z"/></svg>
                    </button>
                    <input name="search" placeholder="search chats" class="placeholder-onedark-lightgray outline-none bg-inherit w-11/12">
                </form>
            </div>
            <div class="h-[calc(100vh-5rem)] overflow-auto">
                {#each chats as chat, i}
                    <div class="h-10 w-full">
                        <button class="text-center text-xl w-full" on:click={(e) => {
                                currentChat = chats[i];
                                console.log(currentChat)
                                console.log(currentChat.messages)
                            }}>{chat.recipient.name}</button>
                    </div>
                {/each}
            </div>
        </div>  
    </div>
    {#if currentChat}
    <div class="col-span-5 h-screen bg-onedark-darkblue">
        <div class="flex justify-center items-center h-10 px-2 bg-onedark-gray">
            <p class="text-center w-full text-2xl">{currentChat.recipient.name}</p>
        </div>
        <div class="px-4 rounded-md bg-onedark-gray h-[calc(100vh-7rem)] overflow-auto my-1">
            {#each currentChat.messages as message, i}
            <div class="w-full">
                <p class="text-xl text-{i%2==0 ? "right" : "left"}">{message.sender.name}</p>
                <pre class="text-{i%2==0 ? "right" : "left"}">{message.text}</pre>
            </div>
            {/each}
        </div>
        <form class="h-16 flex items-center w-full px-2 bg-onedark-gray rounded-md">
            <input placeholder="message to {currentChat.recipient.name}" class="outline-none h-10 w-11/12 bg-inherit px-2">
            <button class="w-1/12 flex justify-center">
                <svg class="fill-onedark-white" height="40" viewBox="0 96 960 960" width="40"><path d="M120 896V256l760 320-760 320Zm66.666-101.999L707.334 576 186.666 355.999v158.668L428 576l-241.334 60v158.001Zm0 0V355.999 794.001Z"/></svg>
            </button>
        </form>
    </div>
    {:else}
    <div class="col-span-5 h-screen flex justify-center items-center">
        <p>No chat selected</p>
    </div>
    {/if}
</div>