<script lang="ts">
	import {RAIIPython} from "$lib/RAIIPython";
    import { onMount } from 'svelte';
    import {RAIITranslator} from "$lib/RAIITranslator";
    //import { onMount } from ""

    onMount(() => {
        const raiiTranslator = new RAIITranslator(fetch,
	        () => {
                console.log("がめお！さと！")
                raiiTranslator.translateToGorgus("JUDGEMENT!")
            }
            );
    })

    //raiiPython.runModule();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
