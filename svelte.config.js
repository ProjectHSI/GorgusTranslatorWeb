import adapterStatic from '@sveltejs/adapter-static';
import adapterNode from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess({ script: true, style: true }),
	kit: {
		adapter: (process.env.USE_NODE_SERVER ? adapterNode : adapterStatic)({
			fallback: "404.html",
		}),
		paths: {
			base: process.argv.includes('dev') || process.env.USE_NODE_SERVER ? "" : "/GorgusTranslatorWeb"
		},
		serviceWorker: {
			register: false
		},
		output: {
			//bundleStrategy: 'inline'
		}
	}
};

export default config;
