<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import AddTrade from './add-trade.svelte';
	import { mockTrades } from './columns';
	import DataTable from './data-table.svelte';

	let error = $state<null | string>(null);
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
		<div class="flex w-full items-center justify-between">
			<h1 class="text-4xl">Trades</h1>
			<div>
				<AddTrade />
			</div>
		</div>
		<div class="mt-8">
			<DataTable data={mockTrades} isLoading={false} />
		</div>
	</div>
{/if}
