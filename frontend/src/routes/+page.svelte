<script lang="ts">
    import { messages } from "$lib/stores/websocket";

    let data: { topic: string, payload: string }[] = [];

    $: data = $messages;
</script>

<main>
    <h1>MQTT Messages</h1>
    <ul>
        {#each data as { topic, payload }}
        <li>
            <strong>{topic}:</strong> {payload}
        </li>
        {/each}
    </ul>
</main>
