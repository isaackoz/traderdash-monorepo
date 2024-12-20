<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { type AddTradeMeta } from '$lib/types/trades';
	import { connectionsState } from '$stores/connections.svelte';
	import type { AddTradeData } from '@repo/shared-schemas';
	import type { Market } from 'ccxt';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { SuperForm, SuperFormData } from 'sveltekit-superforms/client';
	let {
		nextStep,
		prevStep,
		form = $bindable(),
		addTradeMeta = $bindable()
	}: {
		nextStep: (i?: number) => void;
		prevStep: () => void;
		form: SuperForm<AddTradeData>;
		addTradeMeta: AddTradeMeta;
	} = $props();

	const { form: formData } = form;

	let isMounted = $state(false);
	let isLoading = $state(false);
	let searchValue = $state('');
	let error = $state<null | string>(null);

	let spotMarkets = $state<Market[]>([]);

	let filteredSpotMarkets = $derived(
		spotMarkets
			.filter((market) => market?.symbol.toLowerCase().includes(searchValue.toLowerCase()))
			.splice(0, 10)
	);

	function handleSelectMarket(marketSymbol?: string) {
		if (!marketSymbol) {
			return;
		}
		$formData.marketSymbol = marketSymbol;
		addTradeMeta.liveMarket = true;
		nextStep();
	}

	function handleSelectManual() {
		// Skip to last step
		addTradeMeta.liveMarket = false;
		addTradeMeta.trackType = 'manual';
		$formData.marketSymbol = '';
		addTradeMeta.syncTrade = false;
		$formData.fromTimestamp = 0;
		$formData.toTimestamp = 0;
		nextStep(4);
	}

	onMount(async () => {
		try {
			if (!connectionsState.isLoaded) {
				error = 'Connections not loaded in memory';
				return;
			}
			const exchange = connectionsState.connections.get($formData.exchangeConnectionId);
			if (!exchange) {
				// This should be impossible and never happen, but just in case
				// toast.error('Exchange not loaded in memory');
				prevStep();
				return;
			}
			const exchangeData = exchange.data;
			const ccxt = exchange.ccxtExchanges;

			// Get all spot markets
			await ccxt.loadMarkets();
			spotMarkets = Object.values(ccxt.markets as Market[]);
			// .filter(
			//	(market) => market?.type === 'spot'
			// );
		} catch (e) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'An unknown error occurred';
			}
		} finally {
			isMounted = true;
		}
	});
</script>

<div class="flex h-full w-full flex-col overflow-y-hidden">
	<h3 class="mb-2 font-semibold">Select a market</h3>
	<Separator />
	{#if error}
		<div
			class="mx-auto flex h-24 w-full max-w-sm flex-col items-center justify-center text-red-500"
		>
			{error}
		</div>
	{:else}
		<div class="flex w-full flex-grow flex-col overflow-y-auto">
			<Input
				class=" mt-4"
				placeholder="Search for a ticker..."
				bind:value={searchValue}
				disabled={!isMounted}
			/>
			<table class="mt-2 max-h-[500px] w-full overflow-auto rounded-sm p-4">
				<thead class="border-b">
					<tr>
						<th class="text-start"> Symbol </th>
						<th class="text-start"> Type </th>
					</tr>
				</thead>
				<tbody>
					{#if !isMounted}
						{#each { length: 10 }}
							<tr>
								<td colspan="2">
									<Skeleton class="h-12 w-full" />
								</td>
							</tr>
						{/each}
					{:else}
						{#each filteredSpotMarkets as market}
							<tr
								class="hover:bg-muted border transition-colors ease-out hover:cursor-pointer"
								onclick={() => handleSelectMarket(market?.symbol)}
							>
								<td class=" p-1">
									{market?.symbol}
								</td>
								<td class="text-muted-foreground p-1">
									{market?.type}
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>

			<p class="text-muted-foreground flex-grow">
				Showing {filteredSpotMarkets.length} of {spotMarkets.length} available markets
			</p>
			<Button type="button" class="w-full" variant="ghost" onclick={handleSelectManual}
				>Manual Input</Button
			>
		</div>
	{/if}
</div>
