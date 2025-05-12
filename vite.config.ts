import { defineConfig } from "vite";
import { sveltekit } from '@sveltejs/kit/vite';
import compileTime from "vite-plugin-compile-time"
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
	plugins: [topLevelAwait(), sveltekit(), compileTime()],

	/*test: {
		include: ['src/!**!/!*.{test,spec}.{js,ts}']
	},*/

	esbuild: {
		target: "esnext"
	},

	build: {
		cssMinify: "lightningcss",
		/*watch: {
			include: ["**!/python_*!/!**"]
		}*/
		sourcemap: true
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
		format: "es"
	}
});
