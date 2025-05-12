<script lang="ts">
	import {onMount} from "svelte";

    let { loadingTips }: { loadingTips: string[] } = $props();

    function changeLoadingTip() {
        currentLoadingTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];
		setTimeout(changeLoadingTip, 8000);
    }

    onMount(() => {
        changeLoadingTip();
    })

    let currentLoadingTip = $state("...");
</script>


<div class="loadingBar">
	<span class="loadingBarText">
		{currentLoadingTip}
	</span>
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
	  width: 100%;
	  text-align: center;
	  color: white;
	  z-index: 2;
	  font-size: 1em;
	  padding-top: 0.1%;
	  padding-bottom: 0.1%;
	  font-family: system-ui;
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