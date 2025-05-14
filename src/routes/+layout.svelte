<script lang="ts">
    import { page } from '$app/state';

	let { children } = $props();

    let pages: { label: string, href: string }[] = [
        { label: "Translator", href: "/" },
        { label: "About", href: "/about/" }
    ]
</script>

<div class="site">
	<div class="siteHeader">
		<!--<a class="siteLink" href="/">Translator</a>-->
		{#each pages as _page}
			<a class="siteLinkDiv" href={import.meta.env.BASE_URL + _page.href} aria-current={page.url.pathname === import.meta.env.BASE_URL + _page.href ? 'page' : undefined}>
				<span class="siteLink">{_page.label}</span>
			</a>
		{/each}
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