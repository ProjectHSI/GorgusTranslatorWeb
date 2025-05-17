<script lang="ts">
    import { page } from '$app/state';
    import { base } from '$app/paths';
    import { dev } from '$app/environment';
    import {afterNavigate, invalidateAll} from "$app/navigation";
    import {RAIITranslator} from "$lib/RAIITranslator";
    import {PythonWorker} from "$lib/PythonWorker.Types";
    import {onMount, setContext} from "svelte";
    import LoadingScreen from "../components/LoadingScreen.svelte";
    import LoadingBar from "../components/LoadingBar.svelte";

	let { children } = $props();

    let pages: { label: string, href: string }[] = [
        { label: "Translator", href: "" },
        { label: "About", href: "about/" }
    ];

    (async () => {
        if (!dev && 'serviceWorker' in navigator) {
	        let serviceWorkerRegistration: ServiceWorkerRegistration = await navigator.serviceWorker.register('./service-worker.js');

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

    let translatorReady: boolean = $state(false);

    let loadingLogs: string[] = $state([]);
    let dependencies: PythonWorker.DependencyGroups | undefined = $state();

    let raiiTranslator: RAIITranslator | undefined = undefined;

    setContext('raiiTranslator', () => raiiTranslator);
    setContext('translatorReady', () => translatorReady);

    onMount(async () => {
        raiiTranslator = new RAIITranslator(fetch,
            () => {
                if (raiiTranslator != undefined) {
                    //console.log("がめお！さと！")
                    //raiiTranslator.translateToGorgus("JUDGEMENT!")
                }
            }
        );

        raiiTranslator.getPythonWorker().addEventListener("message", (event) => {
            const eventData = event.data as PythonWorker.Command;

            switch (eventData.command_type) {
                case PythonWorker.CommandType.WW_Log:
                    loadingLogs.push(eventData.log);
                    break;
                case PythonWorker.CommandType.WW_Dependency:
                    dependencies = eventData.dependencyGroups;
                    break;
            }
        });

        await raiiTranslator.waitUntilTranslatorReady();

        translatorReady = true;
    });
</script>

<div class="site">
	<div class="siteHeader">
		<!--<a class="siteLink" href="/">Translator</a>-->
		<a class="siteLinkDiv" href="{base}/" aria-current={page.url.pathname === `${base}/` ? "page" : ""}>
			<span class="siteLink">Translator</span>
		</a>
		<a class="siteLinkDiv" href="{base}/about" aria-current={page.url.pathname === `${base}/about/` ? "page" : ""}>
			<span class="siteLink">About</span>
		</a>
		<!--<a class="siteLink" href="/about/">About</a>-->
	</div>
	{#if !page.data.usesTranslator && !translatorReady}
		<div class="freeFloatingLoadingBar">
			<LoadingBar dependencies={dependencies} loadingLogs={loadingLogs}/>
		</div>
	{/if}
	<div class="siteMain">
		<!--<main>--><!--{@render children()}-->
		<div class="siteChildrenContainer">
			{#if page.data.usesTranslator}
				<LoadingScreen dependencies={dependencies} loadingLogs={loadingLogs} loadingScreenActive={!translatorReady}>
					{@render children()}
				</LoadingScreen>
			{:else}
				{@render children()}
			{/if}
		</div>
		<!--</main>-->
	</div>
</div>

<style lang="scss">
	.site {
	  display: flex;
	  flex-direction: column;

	  margin: 8px;

	  width: calc(100dvw - 16px);
	  height: calc(100dvh - 16px);
	}

	.siteHeader {
	  height: 9vh;

	  margin-bottom: 1vh;

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
	  //align-items: stretch;
	  //overflow: auto;
	}

	.siteChildrenContainer {
	  width: 100%;
	  height: 100%;
	}

	.freeFloatingLoadingBar {
	  height: 20%;
	}
</style>