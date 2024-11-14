<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { connectToSocketIO } from "$lib/ws/ws-client";

    let messages: string[] = [];

    onMount(() => {
        const socket =connectToSocketIO((message) => {
            messages = [message, ...messages];
        });

        onDestroy(() => socket.disconnect());
    });
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
