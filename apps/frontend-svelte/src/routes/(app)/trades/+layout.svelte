<script lang="ts">
	import { onMount } from 'svelte';
	import { publicTradesWsState } from '$stores/connections.svelte';
	import { setTradesState } from '$lib/context/trades-context.svelte.js';
	let { children, data } = $props();
	const tradesState = setTradesState({ todo: 'test' });

	onMount(() => {
		// Subscribe to public websockets for each exchange to get the prices
		if (!publicTradesWsState.isLoaded) {
			// Note: it should always be true
			return;
		}
		// Track all cleanup functions
		const stopWatchingFunctions = data.myTrades.exchangeWithTickers.map((connection) => {
			return tradesState.watchTickers(connection.exchangeId, connection.tickerSymbols);
		});

		// Cleanup on unmount
		return () => {
			stopWatchingFunctions.forEach((stopWatching) => stopWatching());
		};
	});
</script>

{@render children()}
