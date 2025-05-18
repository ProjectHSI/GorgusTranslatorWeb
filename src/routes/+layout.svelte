<script lang="ts">
    import { page } from '$app/state';
    import { base } from '$app/paths';
    import { dev } from '$app/environment';
    import {afterNavigate, invalidateAll} from "$app/navigation";
    import {RAIITranslator} from "$lib/RAIITranslator.svelte";
    import {PythonWorker} from "$lib/PythonWorker.Types";
    import {onMount, setContext} from "svelte";
    import LoadingScreen from "../components/LoadingScreen.svelte";
    import LoadingBar from "../components/LoadingBar.svelte";
    import type {TranslatorState} from "$lib/TranslatorStateManagement"
    import {setTranslatorState} from "$lib/TranslatorStateManagement";

    let { children } = $props();

    let pages: { label: string, href: string }[] = [
        { label: "Translator", href: "" },
        { label: "About", href: "about/" }
    ];

    (async () => {
        if (!dev && 'serviceWorker' in navigator) {
	        let serviceWorkerRegistration: ServiceWorkerRegistration = await navigator.serviceWorker.register(`${base}/service-worker.js`);

            serviceWorkerRegistration.addEventListener("updatefound", () => {
                console.log('refresh');
                location.reload();
            });

            if (serviceWorkerRegistration.active && !navigator.serviceWorker.controller) {
                console.log("refresh");
                location.reload();
            }
	    }
    })();

    afterNavigate((navigation) => {
        let data: App.PageData
    })

    //console.log("Base Path", import.meta.env.BASE_URL);

    /*if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(
            import.meta.env.MODE === 'production' ? '/SW.js' : '/SW.js?dev-sw'
        )
    }*/

    let translatorState: TranslatorState = $state({
	    translatorReady: false,
	    raiiTranslator: undefined
    })

    //let loadingLogs: string[] = $state([]);
    //let dependencies: PythonWorker.DependencyGroups | undefined = $state();

    //let raiiTranslator: RAIITranslator | undefined = undefined;

    //setContext('raiiTranslator', () => raiiTranslator);
    //setContext('translatorState', translatorState);
    setTranslatorState(translatorState);
    //setContext('translatorReady', () => translatorReady);

    onMount(async () => {
        translatorState.raiiTranslator = new RAIITranslator(fetch, () => {});

        await translatorState.raiiTranslator.waitUntilTranslatorReady();

        translatorState.translatorReady = true;
    });
</script>

<div class="siteContainer">
	<div class="site">
		<div class="siteHeader">
			<!--<a class="siteLink" href="/">Translator</a>-->
			<a class="siteLinkDiv" href="{base}/" aria-current={page.url.pathname === `${base}/` ? "page" : ""}>
				<span class="siteLink">Translator</span>
			</a>
			<a class="siteLinkDiv" href="{base}/dictionary" aria-current={page.url.pathname === `${base}/dictionary/` ? "page" : ""}>
				<span class="siteLink">Dictionary</span>
			</a>
			<a class="siteLinkDiv" href="{base}/about" aria-current={page.url.pathname === `${base}/about/` ? "page" : ""}>
				<span class="siteLink">About</span>
			</a>
			<!--<a class="siteLink" href="/about/">About</a>-->
		</div>
		{#if !page.data.usesTranslator && !translatorState.translatorReady}
			<div class="freeFloatingLoadingBar">
				<LoadingBar/>
			</div>
		{/if}
		<div class="siteMain">
			<!--<main>--><!--{@render children()}-->
			<div class="siteChildrenContainer">
				{#if page.data.usesTranslator}
					<LoadingScreen dependencies={translatorState.raiiTranslator?.dependencies} loadingLogs={translatorState.raiiTranslator?.loadingLogs} loadingScreenActive={!translatorState.translatorReady}>
						{@render children()}
					</LoadingScreen>
				{:else}
					{@render children()}
				{/if}
			</div>
			<!--</main>-->
		</div>
	</div>
</div>

<style lang="scss">
    .siteContainer {
      display: flex;
      flex-direction: row;
      width: 100dvw;
      height: 100dvh;

      align-items: center;
      justify-content: center;
    }

	.site {
	  display: flex;
	  flex-direction: column;
	  align-items: center;

	  margin: 8px;

	  width: calc(100% - 16px);
	  //width: 100%;
	  height: calc(100% - 16px);

	  font-family: system-ui;
	}

	.siteHeader {
	  height: 9dvh;
	  width: 100%;
	  flex-shrink: 0;

	  margin-bottom: 1dvh;

	  display: flex;
	  flex-direction: row;
	}

	.siteLinkDiv {
	  flex-grow: 1;
	  height: 100%;

	  background-color: rgb(240, 240, 240);

	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;

      text-decoration: none;

	  margin-right: 2.5%;
	  margin-left: 2.5%;
	}

	.siteLink {
	  color: black;

	  font-family: system-ui;
	}

	.siteLinkDiv:first-child {
	  margin-left: 0;
	}

	.siteLinkDiv:last-child {
	  margin-right: 0;
	}

	.siteLinkDiv[aria-current='page'] {
	  background-color: rgb(220, 220, 220);
	}

	.siteMain {
	  display: flex;
	  flex-grow: 1;
	  width: 100%;
	  align-items: center;
	  justify-content: center;
	  overflow: auto;
      //overflow: scroll;
	  //align-items: stretch;
	  //overflow: auto;
	}

	.siteChildrenContainer {
	  width: 100%;
	  height: 100%;
	  overflow: auto;
	}

	.siteChildrenContainerVisibleLoadingBar {
	  height: 70dvh;
	}

	.freeFloatingLoadingBar {
	  height: 20dvh;
	  width: 100%;
	}
</style>