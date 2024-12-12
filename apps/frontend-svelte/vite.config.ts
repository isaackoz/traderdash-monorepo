import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [
		nodePolyfills({
			include: ['buffer', 'util', 'stream', 'net', 'url']
		}),
		sveltekit()
	],
	resolve: {
		alias: {
			net: 'node-stdlib-browser/net'
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	optimizeDeps: { include: ['http-proxy-agent', 'https-proxy-agent', 'socks-proxy-agent'] }
});
