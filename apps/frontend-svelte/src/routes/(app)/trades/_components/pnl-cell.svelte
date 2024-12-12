<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { getTradesState } from '$lib/context/trades-context.svelte';
	import type { TradesTableRow } from '$lib/types/trades';
	import { cn } from '$lib/utils';
	import { formatMarket } from '$lib/utils/money';

	let {
		exchangeId,
		marketSymbol,
		tickerQuote,
		direction,
		calculatedAverageEntry,
		calculatedPositionSize
	}: TradesTableRow = $props();
	const tradesState = getTradesState();

	let price = $derived.by((): { pnl: number; percentage: number } | undefined => {
		// Calculate the PNL
		let pnl = 0;
		let percentage = 0;
		const currentPrice = tradesState.prices.get(`${exchangeId}-${marketSymbol}`)?.last;
		if (!currentPrice) {
			return undefined;
		}
		if (direction === 'buy') {
			pnl = (currentPrice - calculatedAverageEntry) * calculatedPositionSize;
			percentage = ((currentPrice - calculatedAverageEntry) / calculatedAverageEntry) * 100;
		} else {
			pnl = (calculatedAverageEntry - currentPrice) * calculatedPositionSize;
			percentage = ((calculatedAverageEntry - currentPrice) / calculatedAverageEntry) * 100;
		}
		return {
			pnl: pnl,
			percentage: Number(percentage.toFixed(2))
		};
	});
</script>

<span class={cn(price && price.pnl > 0 ? 'text-green-500' : 'text-red-500', 'font-semibold')}>
	{#if !price}
		<Skeleton class="h-4 w-16" />
	{:else}
		{formatMarket(price.pnl, tickerQuote)}
		<span class="text-xs font-light">
			{price.percentage && `(${price.percentage > 0 ? '+' : ''}${price.percentage}%)`}
		</span>
	{/if}
</span>
