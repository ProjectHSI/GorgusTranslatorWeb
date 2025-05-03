import { defineConfig } from "vite";
import { sveltekit } from '@sveltejs/kit/vite';
import compileTime from "vite-plugin-compile-time"

export default defineConfig({
	plugins: [sveltekit(), compileTime()],

	/*test: {
		include: ['src/!**!/!*.{test,spec}.{js,ts}']
	},*/



	build: {
		cssMinify: "lightningcss",
		/*watch: {
			include: ["**!/python_*!/!**"]
		}*/
		//sourcemap: "inline"
	},
	server: {
		watch: {
			ignored: ["**/python/**"], // infinite hmr updates otherwise

		}
	}
});
