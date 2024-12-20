import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
	plugins: [
		nodePolyfills({
			include: ['buffer', 'util', 'stream', 'url']
		}),
		sveltekit()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	resolve: {
		alias: {
			'node:net': path.resolve(__dirname, './etc/mock-node-isip.js')
		}
	},
	optimizeDeps: { include: ['ccxt'] }
});
