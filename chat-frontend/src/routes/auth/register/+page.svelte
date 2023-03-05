<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<div class="w-screen h-screen flex justify-center items-center">
    <div class="flex bg-onedark-darkblue rounded-xl w-1/2 h-1/2 text-center shadow-lg border-2 border-onedark-darkblue justify-center items-center">
        <form method="post" action="?/register" use:enhance class="w-2/3 space-y-8">
            <input name="username" type="text" placeholder="username" class="w-full outline-none bg-inherit border-b-2 border-onedark-lightgray">
            <input name="password" type="password" placeholder="password" class="w-full outline-none bg-inherit border-b-2 border-onedark-lightgray">
            <div  class="w-full">
                <button type="submit" class="border-2 px-2 rounded-md md:text-xl text-md border-onedark-lightgray">Register</button>
            </div>
            <div>
                <a href="/auth/login">already have an account?</a>
            </div> 
        </form>       

    </div>
</div>