import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess({ script: true, style: true }),
	kit: { adapter: adapter({
			fallback: "404.html"
		}), paths: {
			base: process.argv.includes('dev') ? "" : "/GorgusTranslatorWeb"
		} }
};

export default config;
