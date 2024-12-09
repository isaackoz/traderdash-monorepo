<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { type AddTradeMeta } from '$lib/types/trades';
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
	import type { SuperForm, SuperFormData } from 'sveltekit-superforms/client';
	import StepThreeSelect from './step-three-select.svelte';
	let {
		nextStep,
		form = $bindable(),
		prevStep,
		addTradeMeta = $bindable()
	}: {
		nextStep: () => void;
		prevStep: () => void;
		form: SuperForm<AddTradeData>;
		addTradeMeta: AddTradeMeta;
	} = $props();
	const { form: formData } = form;

	let isMounted = $state(false);
	let error = $state<null | string>(null);
	let isLoading = $state(false);
	let isDetailsVisible = $state(false);
	let detailItem = $state<Trade | null>(null);

	let myTrades = $state<Trade[]>([]);

	function handleSelectSkip() {
		$formData.initialAmount = 0;
		$formData.entryPrice = 0;
		$formData.fromTimestamp = Date.now();
		$formData.fromTradeId = '';
		$formData.side = 'buy';
		addTradeMeta.trackType = 'manual';
		addTradeMeta.syncTrade = false;
		nextStep();
	}

	onMount(async () => {
		try {
			const exchange = connectionsState.connections.get($formData.exchangeConnectionId);
			if (!exchange) {
				error = 'Exchange not loaded in memory';
				return;
			}

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

<div class="relative flex h-full w-full flex-col overflow-y-hidden">
	{#if isDetailsVisible && detailItem}
		<StepThreeSelect
			bind:addTradeMeta
			bind:isDetailsVisible
			bind:formData={form.form}
			{nextStep}
			{detailItem}
		/>
	{/if}

	<h3 class="font-semibold">Select a trade to begin tracking from</h3>

	<Separator />
	<div class="flex w-full flex-grow flex-col overflow-y-auto">
		<Table class="flex-grow overflow-hidden">
			<TableHeader class="">
				<TableRow class="text-xs hover:bg-transparent">
					<TableHead class="px-8 text-start">Symbol</TableHead>
					<TableHead class=" text-start">Date</TableHead>
					<TableHead class="w-full px-4 text-left">Amount</TableHead>
					<TableHead class="h-1 w-4"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody class="">
				{#if !isMounted}
					{#each { length: 10 }}
						<TableRow>
							<TableCell colspan={4}>
								<Skeleton class="h-5 w-full" />
							</TableCell>
						</TableRow>
					{/each}
				{:else}
					{#if myTrades.length === 0}
						<TableRow>
							<TableCell colspan={5} class="py-8 text-sm text-yellow-500">
								No trades available to import for this market. Choose another market or manually add
								one instead.
							</TableCell>
						</TableRow>
					{/if}
					{#each myTrades as trade}
						<TableRow
							class="hover:bg-muted group whitespace-nowrap rounded-md text-xs transition-colors ease-out hover:cursor-pointer [&>td]:h-12"
							onclick={(e) => {
								e.preventDefault();
								detailItem = trade;
								isDetailsVisible = true;
							}}
						>
							<TableCell class="h-fit text-center">
								{trade?.symbol}
							</TableCell>
							<TableCell class="text-muted-foreground whitespace-nowrap">
								{new Date(trade?.datetime ?? '').toLocaleDateString()}
							</TableCell>
							<TableCell
								class={cn(
									'w-full px-4 text-left',
									trade.side === 'buy' ? 'text-green-500' : 'text-red-500'
								)}
							>
								{trade.amount}
							</TableCell>
							<TableCell
								class="flex h-fit w-full items-center justify-center  transition-colors group-hover:text-blue-500"
							>
								<InfoIcon class="size-6" />
							</TableCell>
						</TableRow>
					{/each}
				{/if}
			</TableBody>
		</Table>
	</div>
	<Button class="mt-4 w-full " disabled={isLoading || myTrades.length < 10}>Load More...</Button>
	<div class="mt-4">
		<Button variant="ghost" class="w-full" type="button" onclick={handleSelectSkip}
			>Skip (Manually Track)</Button
		>
	</div>
</div>
