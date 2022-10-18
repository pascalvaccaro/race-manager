import { defineConfig, loadEnv } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import fetch from "node-fetch";

export default defineConfig(async ({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const { PUBLIC_STRAPI_URL } = env;

	if (command === "serve" && mode !== "development") {
		process.env.STRAPI_API_TOKEN = await fetch(new URL('/atonallure/website/token', PUBLIC_STRAPI_URL))
			.then(res => res.json()).then(res => res.accessKey).catch(() => process.exit(1));
	}
	return {
		plugins: [sveltekit()]
	};
});
