<script lang="ts">
	//import {PythonWorker} from "$lib/PythonWorker";
    import { onMount } from 'svelte';
    import {RAIITranslator} from "$lib/RAIITranslator";
    //import { onMount } from ""

	let raiiTranslator: RAIITranslator | undefined = undefined;

    onMount(() => {
        raiiTranslator = new RAIITranslator(fetch,
	        () => {
                if (raiiTranslator != undefined) {
                    //console.log("がめお！さと！")
                    //raiiTranslator.translateToGorgus("JUDGEMENT!")
                }
            }
            );
    })

    //raiiPython.runModule();
    let inputString: string = $state("");
    let outputString: string = $state("");
    let firstTime: boolean = false;

    $effect(() => {
        inputString; // intentional

        if (!firstTime) {
            console.warn("cancel")

            // prevent madness
            firstTime = true;
            return;
        }

        //console.log("T R A N S L A T E D")

        if (raiiTranslator != undefined && raiiTranslator.isTranslatorReady())
            raiiTranslator.translateToGorgus(inputString).then((translatedString: string) => {
                outputString = translatedString;
            }).catch((rejectedReason: Error) => {
                if (rejectedReason.message != "bruh")
                    throw rejectedReason;
            });
    })

	//console.log(new SharedArrayBuffer(255).byteLength);
</script>

<!--<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>-->
<input contenteditable="plaintext-only" style:width="40%" bind:value={inputString}>
<input contenteditable="false" style:width="40%" bind:value={outputString}>
<!--<button onclick={() => {console.log("sanity")}}>test</button>-->
