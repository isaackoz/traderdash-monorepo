<script lang="ts">
	import { connectionsState } from '$lib/stores/connections.svelte';
	import { fiatCurrencies } from '$lib/types/constants';
	import type { PortfolioItem } from '$lib/types/portfolio';
	import { onMount } from 'svelte';
	import DataTable from './data-table.svelte';
	import { buildTreemapData, calculatePortfolioTotal, calculateTotalsByExchange } from './util';
	import { pieChart } from './exchange-pie-chart.svelte';
	import { tickerTreeMap } from './ticker-tree-map.svelte';
	import { formatCurrency } from '$lib/utils/money';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { getExchangeName } from '$lib/utils/exchange';

	let data = $state<PortfolioItem[]>([]);
	let isDoneMounting = $state(false);
	let error = $state<null | string>(null);

	let summaryData = $derived.by(() => {
		return calculatePortfolioTotal(data);
	});

	let aggregatedTotalByExchange = $derived.by(() => {
		return calculateTotalsByExchange(data);
	});

	let treemapData = $derived.by(() => {
		return buildTreemapData(data);
	});

	$inspect(treemapData);

	onMount(async () => {
		try {
			const accountBalances = (
				await Promise.all(
					connectionsState.connections.entries().map(async (connection) => {
						const exchangeData = connection[1].data;
						const exchange = connection[1].ccxtExchanges;
						await exchange.loadMarkets();
						const bal = await exchange.fetchBalance();
						const total = bal?.total as unknown as Record<string, number>;

						let tickersToFetch: string[] = [];
						// Get all tickers that have their balance higher than 0 and keep the balance
						const tickers = Object.entries(total).reduce<PortfolioItem[]>((acc, [key, value]) => {
							if (value > 0) {
								if (key in fiatCurrencies) {
									// If the ticker is a fiat, ignore it in our fetch
									acc.push({
										ticker: key,
										balance: value,
										exchangeId: exchangeData.exchangeId,
										type: 'fiat',
										price: value, // <-- If it's a fiat, the price will be the value (give or take a few cents)
										intlCurrency: fiatCurrencies[key].intlCurrency
									});
								} else {
									// Otherwise, add it to the tickers to fetch (this avoids errors with pairs such as 'USD/USD')
									tickersToFetch = [...tickersToFetch, `${key}/USDT`];
									acc.push({
										ticker: key,
										balance: value,
										exchangeId: exchangeData.exchangeId,
										type: 'coin',
										price: null
									});
								}
							}
							return acc;
						}, []);
						const hasTickersMethod = typeof connection[1].ccxtExchanges.fetchTickers == 'function';
						if (hasTickersMethod && tickersToFetch.length > 0) {
							const tickerValues = await connection[1].ccxtExchanges.fetchTickers(tickersToFetch);
							Object.entries(tickerValues).forEach(([key, value]) => {
								// Mutate the data and modify the data
								// Key will look like ETH/USDT
								const [ticker, _] = key.split('/');
								const tickerData = tickers.find((t) => t.ticker === ticker);
								if (tickerData) {
									tickerData.price = value.last as number;
								}
							});
						}

						return tickers;
					})
				)
			).flat();

			/**
			 * Update ticker data in the $state
			 */

			data = accountBalances;
		} catch (e) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'An unknown error occurred while fetching your portfolio';
			}
			console.group('PORTFOLIO-ERROR');
			console.error('Error in mounting /portfolio', e);
			console.groupEnd();
		} finally {
			isDoneMounting = true;
		}
	});
</script>

{#if error}
	<div
		class="mx-auto flex h-full w-full max-w-sm flex-col items-center justify-center text-red-500"
	>
		<p>Uh oh there was an error loading your portfolio.</p>
		<code>Reason: {error}</code>
		<div class="text-foreground mt-4 text-center">
			<p>
				Check if your API keys are valid. If the problem still persists, contact support or hit F12
				and view the error message in the developer console.
			</p>
		</div>
	</div>
{:else}
	<div class="mx-auto mt-12 max-w-7xl">
		{#if !isDoneMounting}
			<div class="mb-12 flex h-96 w-full space-x-8">
				{#each { length: 3 }}
					<Skeleton class="h-96 w-1/3 rounded-3xl" />
				{/each}
			</div>
		{:else}
			<div class="mb-12 flex h-96 w-full space-x-8">
				{#key summaryData}
					<div class="bg-muted h-96 w-1/3 rounded-3xl p-8">
						<h2 class="flex flex-col text-xl">
							<span> Portfolio Total </span>
							<span class="text-4xl font-semibold text-green-500">
								{formatCurrency(summaryData.total)}
							</span>
						</h2>
						<div class="mt-4">
							<span class="text-muted-foreground text-lg">Total By Exchange</span>
							<ScrollArea class="h-full">
								<div class="grid [grid-template-columns:auto_auto_1fr;]">
									{#each summaryData.totalByExchange as exchangeTotal, index}
										<div class="text-muted-foreground">{index + 1}</div>
										<div class=" ml-4 mr-8">{getExchangeName(exchangeTotal.exchangeId)}</div>
										<div class="text-green-500">{formatCurrency(exchangeTotal.total)}</div>
									{/each}
								</div>
							</ScrollArea>
						</div>
					</div>
				{/key}
				{#key aggregatedTotalByExchange}
					<div class="bg-muted h-96 w-1/3 rounded-3xl p-8">
						<div use:pieChart={aggregatedTotalByExchange} class="h-full w-full"></div>
					</div>
				{/key}
				{#key treemapData}
					<div class="bg-muted h-96 w-1/3 rounded-3xl p-8">
						<div use:tickerTreeMap={treemapData} class="h-full w-full"></div>
					</div>
				{/key}
			</div>
		{/if}
		<DataTable {data} isLoading={!isDoneMounting} />
	</div>
{/if}
