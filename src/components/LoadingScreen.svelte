<script lang="ts">
	import LoadingBar from "./LoadingBar.svelte";
    import {PythonWorker} from "$lib/PythonWorker.Types";

    let { children, dependencies, loadingScreenActive, loadingLogs }: { children: any, dependencies: PythonWorker.DependencyGroups | undefined, loadingScreenActive: boolean, loadingLogs?: string[] } = $props();

    $inspect(loadingScreenActive)
</script>

<div class="loadingScreenContainer">
	<div class="loadingScreenChildren">
		{@render children()}
	</div>
	{#if loadingScreenActive}
		<div class="loadingScreen">
			<div class="loadingBarContainer">
				<LoadingBar dependencies={dependencies} loadingLogs={loadingLogs}/>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.loadingScreenContainer {
	  position: relative;

	  width: 100%;
	  height: 100%;

        //display: flex;
        //flex-direction: column;
	}

	.loadingScreen {
		position: absolute;
		display: inline-block;

		width: 100%;
		height: 100%;

	    //flex-grow: 1;

		top: 0;

		z-index: 2;

		background-color: rgba(255, 255, 255, 0.6);
	}

	.loadingBarContainer {
		position: relative;
		width: 99%;
	    height: 99%;
		left: 0.5%;
		top: 0.5%;
	}

	.loadingScreenChildren {
		//position: relative;
		//display: inline-block;

		//top: 0;

		z-index: 1;
		overflow: auto;
		width: 100%;
		height: 100%;
	}
</style>