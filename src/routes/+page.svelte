<script lang="ts">
	//import {PythonWorker} from "$lib/PythonWorker";
    import {getContext, onMount, untrack} from 'svelte';
    import {RAIITranslator} from "$lib/RAIITranslator.svelte";
    //import LoadingBar from "../components/LoadingBar.svelte";
    //import LoadingTips from "$lib/loadingTips"
    import LoadingScreen from "../components/LoadingScreen.svelte";
    import {beforeNavigate, onNavigate} from "$app/navigation";
    import {page} from "$app/state";
    import {PythonWorker} from "$lib/PythonWorker.Types";
    import {getTranslatorState} from "$lib/TranslatorStateManagement";

    //let translatorReady: boolean = getContext("translatorReady");
    const translatorState = getTranslatorState();

    //raiiPython.runModule();
    let inputString: string = $state("");
    let outputString: string = $state("");
    let firstTime: boolean = false;
    let doNotTranslate = false;

    $effect(() => {
        inputString; // intentional
	    shouldTranslationBeFormal;

        if (!firstTime || doNotTranslate) {
            console.warn("cancel")

            // prevent madness
            firstTime = true;
            return;
        }

        //console.log("T R A N S L A T E D")

        if (translatorState.raiiTranslator !== undefined && translatorState.raiiTranslator.isTranslatorReady()) {
            //let translationPromise: Promise<string> | undefined;

            //switch (translationTargetOption) {
	            //case "English -> Gorgus":
            translatorState.raiiTranslator.translate(inputString, translationTargetOption == "English -> Gorgus" ? "G" : "E", shouldTranslationBeFormal).then((translatedString: string) => {
                        outputString = translatedString;
                    }).catch((rejectedReason: Error) => {
                        if (rejectedReason.message != "bruh")
                            throw rejectedReason;
                    });
        }
    });

    /*$effect(() => {
        gorgusString; // intentional

        if (!firstTime || doNotTranslate) {
            console.warn("cancel")

            // prevent madness
            firstTime = true;
            return;
        }

        //console.log("T R A N S L A T E D")

        if (raiiTranslator != undefined && raiiTranslator.isTranslatorReady())
            raiiTranslator.translateToEnglish(gorgusString).then((translatedString: string) => {
                englishString = translatedString;
            }).catch((rejectedReason: Error) => {
                if (rejectedReason.message != "bruh")
                    throw rejectedReason;
            });
    });*/

    $effect(() => {
        translationTargetOption;

	    //doNotTranslate = true;

        {
            //let _inputString = inputString;
            //let _outputString = outputString;

            untrack(() => { inputString = outputString });
            //outputString = _inputString;
        }

        //doNotTranslate = false;
    })

	//console.log(new SharedArrayBuffer(255).byteLength);
	let translationTargetOption = $state("English -> Gorgus");
    //$inspect(translationTargetOption);
    /*let translationTargetOptionAsEnum = $derived(() => {
        return
    });*/

    let textAreaStyle = $state("");
    let shouldTranslationBeFormal = $state(true);
</script>

<!--<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>-->
<div class="mainTranslationControls">
<textarea
		disabled={!translatorState.translatorReady}
		class="translationTextArea"
		bind:value={inputString}>
</textarea>
	<select class="translationTarget" bind:value={translationTargetOption}>
		<option class="translationTargetOption" id="toG">English -> Gorgus</option>
		<option class="translationTargetOption" id="toE">Gorgus -> English</option>
	</select>
	<textarea disabled={!translatorState.translatorReady} contenteditable="false" class="translationTextArea">{outputString}</textarea>
</div>
{#if translationTargetOption === "English -> Gorgus"}
	<div class="translationOptions">
		<div>
			<input type="checkbox" id="toGFormal" bind:checked={shouldTranslationBeFormal}>
			<label for="toGFormal" class="translationOption">Formal</label>
		</div>
	</div>
{/if}

<style lang="scss">
    .mainTranslationControls {
      display: flex;
      align-items: center;
      flex-direction: row;
    }

	.translationTextArea {
	  width: 40%;
	  height: 16em;
	  resize: none;
	  flex-grow: 1;
	  //resize: vertical;
	}

	.translationTarget {
	  width: 18%;
	  margin-left: 1%;
	  margin-right: 1%;
	  text-align: center;
	}

	.translationTargetOption {
	  text-align: center;
	}

	.translationOptions {
	  display: flex;
	  width: 100%;
	  align-items: center;
	  justify-content: center;
	  flex-direction: row;
	}

	.translationOption {
	  font-family: system-ui;
	}
</style>
<!--<button onclick={() => {console.log("sanity")}}>test</button>-->
