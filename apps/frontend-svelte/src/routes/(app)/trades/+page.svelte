<script lang="ts">
	import type { PageData } from './$types';
	import AddTrade from './add-trade.svelte';
	import DataTable from './data-table.svelte';
	let { data }: { data: PageData } = $props();

	// let tradeItem = $derived.by<TradesItem[]>(() => {});

	let error = $state<null | string>(null);
</script>

{#if error}
	<div
		class="mx-auto flex h-full w-full max-w-sm flex-col items-center justify-center text-red-500"
	>
		<p>Uh oh there was an error loading your portfolio.</p>
		<code>Reason: {error}</code>
		<div class="mt-4 text-center text-foreground">
			<p>
				Check if your API keys are valid. If the problem still persists, contact support or hit F12
				and view the error message in the developer console.
			</p>
		</div>
	</div>
{:else}
	<div class="mx-auto mt-12 max-w-7xl">
		<div class="flex w-full items-center justify-between">
			<h1 class="text-4xl">Trades</h1>
			<div class="">
				<AddTrade />
			</div>
		</div>
		<div class="mt-8">
			<DataTable data={data.myTrades.tradeitems} isLoading={false} />
		</div>
	</div>
{/if}
