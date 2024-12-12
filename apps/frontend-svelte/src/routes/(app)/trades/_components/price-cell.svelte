<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { getTradesState } from '$lib/context/trades-context.svelte';
	import { cn } from '$lib/utils';
	import { formatMarket } from '$lib/utils/money';

	let {
		exchangeId,
		marketSymbol,
		quote
	}: { exchangeId: string; marketSymbol: string; quote: string } = $props();

	const tradesState = getTradesState();
	let dir = $state<'up' | 'down' | 'same'>('same');
	let lastValue: number | undefined;
	let spanElementRef: HTMLSpanElement;

	let price = $derived(tradesState.prices.get(`${exchangeId}-${marketSymbol}`)?.last);

	$effect(() => {
		// Remove it's class
		spanElementRef.classList.remove('animate-blink-green', 'animate-blink-red');

		void spanElementRef.offsetWidth;

		if (price && lastValue) {
			if (price > lastValue) {
				spanElementRef.classList.add('animate-blink-green');
			} else if (price < lastValue) {
				spanElementRef.classList.add('animate-blink-red');
			}
		}
		lastValue = price;
	});
</script>

<span bind:this={spanElementRef}>
	{#if !price}
		<Skeleton class="h-4 w-16" />
	{:else}
		{formatMarket(price, quote)}
	{/if}
</span>
