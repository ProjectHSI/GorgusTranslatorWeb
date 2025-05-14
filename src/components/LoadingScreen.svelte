<script lang="ts">
	import LoadingBar from "./LoadingBar.svelte";

    let { children, loadingScreenActive }: { children: any, loadingScreenActive: boolean } = $props();

    $inspect(loadingScreenActive)
</script>

<div class="loadingScreenContainer">
	<div class="loadingScreenChildren">
		{@render children()}
	</div>
	{#if loadingScreenActive}
		<div class="loadingScreen">
			<div class="loadingBarContainer">
				<LoadingBar />
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
		width: 90%;
		left: 5%;
		top: 10%;
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