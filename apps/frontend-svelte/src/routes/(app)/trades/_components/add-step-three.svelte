<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { cn } from '$lib/utils';
	import { getExchangeName } from '$lib/utils/exchange';
	import { connectionsState } from '$stores/connections.svelte';
	import { exchangeConfigs } from '@repo/exchange-info';
	import type { AddTradeData } from '@repo/shared-schemas';
	import type { Trade } from 'ccxt';
	import { InfoIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';
	import type { SuperFormData } from 'sveltekit-superforms/client';
	let {
		nextStep,
		formData = $bindable(),
		prevStep
	}: {
		nextStep: () => void;
		prevStep: () => void;
		formData: SuperFormData<AddTradeData>;
	} = $props();

	let isMounted = $state(false);
	let error = $state<null | string>(null);
	let isDetailsVisible = $state(false);
	let detailItem = $state<Trade | null>(null);

	let myTrades = $state<Trade[]>([]);

	onMount(async () => {
		try {
			const exchange = connectionsState.get($formData.exchangeConnectionId);
			if (!exchange) {
				// This should be impossible and never happen, but just in case
				toast.error('Exchange not loaded in memory');
				prevStep();
				return;
			}

			const exchangeData = exchange.data;
			const ccxt = exchange.ccxtExchanges;
			const trades = await ccxt.fetchMyTrades($formData.marketSymbol, undefined, 10, {
				maxEntriesPerRequest: 10,
				paginate: true
			});
			myTrades = trades;
		} catch (e) {
			console.error(e);
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'An unknown error occurred';
			}
		} finally {
			isMounted = true;
		}
	});

	$inspect(myTrades);
</script>

<div class="h-full w-full overflow-y-auto">
	<Tabs value="auto">
		<TabsList class="w-full">
			<TabsTrigger value="auto" class="w-full">Import</TabsTrigger>
			<TabsTrigger value="manual" class="w-full">Manual</TabsTrigger>
		</TabsList>
		<TabsContent value="auto" class="relative">
			{#if isDetailsVisible && detailItem}
				<div
					class="bg-muted absolute bottom-0 left-0 right-0 top-0 z-10 rounded-md p-4"
					transition:fade={{ duration: 100 }}
				>
					<button
						class="bg-muted group absolute right-4 top-2 z-20 flex size-6 items-center justify-center rounded-full transition-colors hover:cursor-pointer hover:bg-red-600"
						onclick={() => {
							isDetailsVisible = false;
							detailItem = null;
						}}
					>
						<span class="text-red-500 group-hover:text-white">x</span>
					</button>
					<h4 class="text-xl font-bold">{detailItem.symbol}</h4>
				</div>
			{/if}

			<h3 class="font-semibold">Select a trade to begin tracking from</h3>
			<Separator />
			<table class="mt-4 max-h-[500px] w-full overflow-auto rounded-sm p-4">
				<thead class="border-b">
					<tr class="text-xs">
						<th class="px-8 text-start"> Symbol </th>
						<th class="w-full text-start"> Date </th>
						<th class="px-4 text-center">Amount</th>
						<th class="">Details</th>
					</tr>
				</thead>
				<tbody class="mt-2 h-[400px]">
					{#if !isMounted}
						{#each { length: 10 }}
							<tr>
								<td colspan="4">
									<Skeleton class="h-10 w-full" />
								</td>
							</tr>
						{/each}
					{:else}
						{#each myTrades as trade}
							<tr
								class="hover:bg-muted rounded-md border text-xs transition-colors ease-out hover:cursor-pointer"
								onclick={() => console.log("I've been clicked")}
							>
								<td class="h-10 p-1 text-center">
									{trade?.symbol}
								</td>
								<td class="text-muted-foreground whitespace-nowrap p-1">
									{new Date(trade?.datetime ?? '').toLocaleDateString()}
								</td>
								<td
									class={cn(
										'w-full px-4 text-left',
										trade.side === 'buy' ? 'text-green-500' : 'text-red-500'
									)}
								>
									{trade.amount}
								</td>
								<td
									class="flex h-10 w-full items-center justify-center transition-colors hover:text-blue-500"
									onclick={(e) => {
										e.preventDefault();
										e.stopImmediatePropagation();
										detailItem = trade;
										isDetailsVisible = true;
									}}
								>
									<InfoIcon class="size-6" />
								</td>
							</tr>
						{/each}
						<tr class="w-full hover:cursor-pointer">
							<td colspan="4" class="">
								<Button class="w-full">Load More...</Button>
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</TabsContent>
	</Tabs>
</div>
