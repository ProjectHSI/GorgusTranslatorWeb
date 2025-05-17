<script lang="ts">
    import {getContext, onMount} from "svelte";
    import {RAIITranslator} from "$lib/RAIITranslator";

    let translatorReady: boolean = getContext("translatorReady");

    async function getDictionary() {
        const raiiTranslator: RAIITranslator | undefined = getContext("raiiTranslator");

        if (!raiiTranslator)
            throw new Error("bruh");

        console.log(await raiiTranslator.getDictionary())
    }

    $effect(() => {
        translatorReady;

       getDictionary()
    });

    onMount(() => {
        if (translatorReady)
            getDictionary();
    })
</script>

<h1 style:margin-top="0">Dictionary</h1>

<style lang="scss">

</style>