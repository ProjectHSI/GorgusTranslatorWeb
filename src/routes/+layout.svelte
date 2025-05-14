<script lang="ts">
    import { page } from '$app/state';

	let { children } = $props();

    let pages: { label: string, href: string }[] = [
        { label: "Translator", href: "" },
        { label: "About", href: "about/" }
    ]

    //console.log("Base Path", import.meta.env.BASE_URL);

    /*if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(
            import.meta.env.MODE === 'production' ? '/SW.js' : '/SW.js?dev-sw'
        )
    }*/
</script>

<div class="site">
	<div class="siteHeader">
		<!--<a class="siteLink" href="/">Translator</a>-->
		<a class="siteLinkDiv" href="/" aria-current={page.url.pathname === "/"}>
			<span class="siteLink">Translator</span>
		</a>
		<a class="siteLinkDiv" href="/about/" aria-current={page.url.pathname === "/about/"}>
			<span class="siteLink">About</span>
		</a>
		<!--<a class="siteLink" href="/about/">About</a>-->
	</div>
	<main>
		<div class="siteMain">

		</div>
		{@render children()}
	</main>
</div>

<style lang="scss">
	.site {
	  display: flex;
	  flex-direction: column;

	  min-height: 100vh;
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
	  flex-grow: 1;
	  overflow: auto;
	}
</style>