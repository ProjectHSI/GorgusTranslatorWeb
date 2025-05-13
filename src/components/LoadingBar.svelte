<script lang="ts">
	import {onMount} from "svelte";
    import type {LoadingTip, LoadingTipInterface} from "$lib/loadingTips";

    let { loadingTips }: { loadingTips: LoadingTip[] } = $props();

    function changeLoadingTip() {
        let newLoadingTip: LoadingTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];

        currentLoadingTip = typeof(newLoadingTip) == "string" ? { quote: newLoadingTip} : newLoadingTip;
		setTimeout(changeLoadingTip, 8000);
    }

    onMount(() => {
        changeLoadingTip();
    })

    let currentLoadingTip: LoadingTipInterface = $state({ quote: "..." });
</script>


<div class="loadingBar">
	<div class="loadingBarTextBox">
		<span class="loadingBarText">
			{currentLoadingTip.quote}
		</span>
		<br />
		{#if currentLoadingTip.author}
			<span class="loadingBarText loadingBarQuoteAuthor">
				<i>~ {currentLoadingTip.author}</i>
			</span>
		{/if}
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
	}

	.loadingBarText {
	  //width: 100%;
	  text-align: center;
	  color: white;
	  font-size: 1em;
	  font-family: system-ui;
	}

	.loadingBarQuoteAuthor {
	  position: relative;
	  flex-grow: 1;
	  right: -50%;
	  //right: 0;
	}

	.loadingBarTextBox {
	  display: flex;
	  flex-direction: column;
	  z-index: 2;
      padding-top: 0.1%;
      padding-bottom: 0.1%;
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
	  animation-duration: 1s;
	  animation-timing-function: linear;
	  animation-iteration-count: infinite;
	}

	@keyframes loadingBarShineAnimation {
	  from {
	    left: -15%;
	  }
	  to {
	    left: 105%;
	  }
	}
</style>