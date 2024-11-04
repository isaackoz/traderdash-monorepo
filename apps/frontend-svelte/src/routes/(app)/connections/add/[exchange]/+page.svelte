<script lang="ts">
	import { exchangeComponents } from '$lib/exchanges.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const component = data.exchangeId ? exchangeComponents[data.exchangeId].addForm : undefined;
</script>

{#snippet form()}
	{@const Component = component}
	{#if Component}
		<Component />
	{:else}
		<p>Connection not found</p>
	{/if}
{/snippet}

{#if component}
	<div class="mx-auto max-w-screen-2xl p-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold">Add Exchange</h1>
				<p class="text-primary/50 text-sm">Add this connection</p>
			</div>
			<div></div>
		</div>
		<div class="mt-10">
			{@render form()}
		</div>
	</div>
{:else}
	<div class="mx-auto flex h-full max-w-screen-2xl items-center justify-center p-8">
		Not found {data.exchangeId}
	</div>
{/if}
