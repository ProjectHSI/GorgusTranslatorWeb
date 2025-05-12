import { defineConfig } from "vite";
import { sveltekit } from '@sveltejs/kit/vite';
import compileTime from "vite-plugin-compile-time"
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
	plugins: [compileTime(), topLevelAwait({
		// The export name of top-level await promise for each chunk module
		promiseExportName: "__tla",
		// The function to generate import names of top-level await promise in each chunk module
		promiseImportName: i => `__tla_${i}`
	}), sveltekit()],

	assetsInclude: ["**/python/lib/**", "**/python/wasm/**"],

	/*test: {
		include: ['src/!**!/!*.{test,spec}.{js,ts}']
	},*/

	//esbuild: {
		//target: "esnext"
	//},

	build: {
		cssMinify: "lightningcss",
		/*watch: {
			include: ["**!/python_*!/!**"]
		}*/
		sourcemap: "inline"
	},
	server: {
		headers: {
			// add COEP header to vite-served modules
			'Cross-Origin-Embedder-Policy': 'require-corp',
			'Cross-Origin-Opener-Policy': 'same-origin'
		},
		watch: {
			ignored: ["**/python/**"], // infinite hmr updates otherwise

		}
	},
	worker: {
		plugins: () => {return [compileTime(), topLevelAwait({
			// The export name of top-level await promise for each chunk module
			promiseExportName: "__tla",
			// The function to generate import names of top-level await promise in each chunk module
			promiseImportName: i => `__tla_${i}`
		})]},
		format: "es"
	}
});
