<script lang="ts">
	import {onMount} from "svelte";
    import type {LoadingTip, LoadingTipInterface} from "$lib/loadingTips";
    import loadingTips from "$lib/loadingTips";

    import type { EasingFunction } from "svelte/transition";
    import { fade } from "svelte/transition";
    import {PythonWorker} from "$lib/PythonWorker.Types";

    //let { loadingTips }: { loadingTips: LoadingTip[] } = $props();
	//let loadingTips = LoadingTips

    function changeLoadingTip() {
        let newLoadingTip: LoadingTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];

        currentLoadingTip = typeof(newLoadingTip) == "string" ? { quote: newLoadingTip} : newLoadingTip;
		setTimeout(changeLoadingTip, 8000);
    }

    onMount(() => {
        changeLoadingTip();
    })

	let { loadingLogs = [], dependencies = [] }: { loadingLogs?: string[], dependencies?: PythonWorker.DependencyGroups } = $props();

    let addLoadingScreenLogs = $derived(loadingLogs !== undefined && loadingLogs.length !== 0);
	let addDependencyTracking = $derived(dependencies !== undefined && dependencies.length !== 0);
    let extendLoadingScreen = $derived(addLoadingScreenLogs || addDependencyTracking);

    let currentLoadingTip: LoadingTipInterface = $state({ quote: "..." });
</script>


<div class={`loadingBar ${extendLoadingScreen ? "loadingBarExtended": ""}`}>
	<div class="loadingBarTextBox">
		<span class="loadingBarText mainLoadingBarText">
			Loading Translator Runtime...
		</span>
		{#if extendLoadingScreen}
			<div class="loadingExtensionArea">
				<!--<div class="loadingExtensionAreaProtection">-->
					{#if addLoadingScreenLogs}
						<div class="loadingExtension loadingBarLogs">
							<!--<div class="loadingBarLogs">-->
								{#each loadingLogs.toReversed() as loadingLog, i}
									<span>{loadingLog}</span>
									{#if i !== loadingLogs.length}
										<br />
									{/if}
								{/each}
							<!--</div>-->
							<!--<div class="loadingBarLogsActual">-->
							<!--</div>-->
						</div>
					{/if}
				{#if addDependencyTracking}
					<div class="loadingExtension">
						<table class="dependencyTable">
							<thead>
								<tr class="dependencyHeading">
									<th>Package</th>
									<th>Status</th>
								</tr>
							</thead>
							{#each dependencies as dependencyGroup}
								<!--<table class="dependencyTable">-->
								<thead>
									<tr class="dependencyGroupHeading">
										<th colspan="2">{dependencyGroup.name}</th>
									</tr>
								</thead>
								<tbody>
								{#each dependencyGroup.dependencies as dependency}
									<tr class={"dependency dependency" + dependency.status}>
										<td>{dependency.name}</td>
										<td>{dependency.status}</td>
									</tr>
								{/each}
								</tbody>
								<!--</table>-->
							{/each}
						</table>
					</div>
				{/if}
			</div>
			<!--</div>-->
		{/if}
		<div class="loadingBarQuote">
			<span class="loadingBarText">
				{currentLoadingTip.quote}
			</span>
			{#if currentLoadingTip.author}
				<span class="loadingBarText loadingBarQuoteAuthor">
					<i>~ {currentLoadingTip.author}</i>
				</span>
			{/if}
		</div>
	</div>
	<div class="loadingBarShine">

	</div>
</div>


<style lang="scss">
	.loadingBar {
	  position: relative;
	  width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
	  //height: 100%;
	  background-color: royalblue;
	  overflow: hidden;

	  color: white;

	  font-family: system-ui;
	}

	.loadingBarExtended {
	  height: 100%;

	  /*animation-name: loadingBoxEnlargen;
	  animation-duration: 2.0s;
	  animation-timing-function: ease-out;*/
	}

    .loadingBarTextBox {
      overflow: auto;

      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      //max-height: 5px;
      width: 100%;
      z-index: 2;
      padding-top: 0.1%;
      padding-bottom: 0.1%;
    }

    .loadingBarTextBoxExtended {
      //height: 100%
    }

    .loadingExtension {
      max-height: 100%;

      overflow: auto;

      flex: 1;
      height: 100%;

      margin-right: 0.5%;
      padding-left: 0.5%;
      margin-left: 0.5%;
      padding-right: 0.5%;

      border-left: 0.5px solid white;
      border-right: 0.5px solid white;
    }

    .loadingExtension:first-child {
      margin-left: 0;
      //padding-left: 0;
      border-left: 0;
      //border-right: 0;
    }

    .loadingExtension:last-child {
      margin-right: 0;
      //padding-right: 0;
      border-right: 0;
    }

    table.dependencyTable {
      border: 1px solid white;
      border-collapse: collapse;

      width: 100%;
      margin-top: 1%;
      margin-bottom: 1%;
    }

    table.dependencyTable th {
      width: 50%;
    }

    table.dependencyTable td, th {
      border: 1px solid white;
      text-align: center;
    }

/*    .dependencyTable:first-child {
      margin-top: 0;
    }

    .dependencyTable:last-child {
      margin-bottom: 0;
    }

    .dependencyGroupHeading th {
      border-bottom: 0.5px solid white;
    }

    .dependencyHeading th{
      //border-top: 0.5px solid white;
      border-bottom: 0.5px solid white;
    }*/

    .dependencyDownloading td {
      color: red;
    }

    .dependencySaving td, .dependencyExtracting td {
      color: yellow;
    }

    .dependencyDone td {
      color: lime;
    }

    .loadingExtensionArea {
      width: 95%;
      height: 0;
      //max-height: min-content;
      flex-grow: 1;
      //height: 98%;

      overflow: clip;

      align-items: center;

      //padding-top: 1%;
      //padding-bottom: 1%;

      border: 1px solid white;
      //padding: 0.5%;
      margin: 0.5%;

      display: flex;
      flex-direction: row;
    }

    .loadingExtensionAreaProtection {
      width: 100%;
      height: 100%;

      align-items: center;

      display: flex;
      flex-direction: row;
    }

	.loadingBarQuote {
	  display: flex;
	  flex-direction: column;
	  align-items: center;

	  //flex: 1;
	  min-width: 25%;
	  max-width: 100%;
	}

	.loadingBarLogs {
	  display: flex;
	  //height: 100%;
	  //flex-grow: 1;
	  //height: 100%;
      //margin-left: 1%;
      //margin-right: 1%;
	  //width: 98%;

	  //align-self: stretch;

	  //align-items: stretch;

      flex-direction: column-reverse;
      font-family: monospace;
      overflow-y: scroll;
	  overflow-x: hidden;

      //max-height: 5%;
      //max-width: 5%;
      //width: 1080px;
      //height: 100%;

      color: white;
	}

	.loadingBarText {
	  //width: 100%;
	  text-align: center;
	  color: white;
	  font-size: 1em;
	  //height: 1em;
	  font-family: system-ui;
	}

	.mainLoadingBarText {
	  font-size: 2em;
	}

	.loadingBarQuoteAuthor {
	  align-self: flex-end;
	  position: relative;
	  //width: max-content;
	  flex-grow: 1;
	  text-align: right;
	  //right: -5%;
	  //right: 0;
	}

	.loadingBarShine {
	  display: inline-block;
	  z-index: 1;
	  width: 10%;
	  //min-height: 100%;
	  height: 800%;
	  flex-grow: 1;
	  position: absolute;
	  top: -350%;
	  left: 45%;
	  rotate: z 22.5deg;
	  background-color: cornflowerblue;

	  animation-name: loadingBarShineAnimation;
	  animation-duration: 5s;
	  animation-timing-function: cubic-bezier(0,.85,1,.15);
	  animation-iteration-count: infinite;
	}

	@keyframes loadingBoxEnlargen {
	  from {
	    height: 4em;
	  }
	  to {
	    height: 100%;
	  }
	}

	@keyframes loadingBarShineAnimation {
	  from {
	    left: -30%;
	  }
	  to {
	    left: 110%;
	  }
	}
</style>