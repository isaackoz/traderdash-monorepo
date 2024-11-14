<script lang="ts">
	import type { PageData } from './$types';
	import AddExchangeForm from './add-exchange-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

{#if data.exchangeId}
	<div class="mx-auto max-w-screen-lg p-8">
		<div class="mt-10"><AddExchangeForm exchangeId={data.exchangeId}></AddExchangeForm></div>
	</div>
{:else}
	<div class="mx-auto flex h-full max-w-screen-2xl items-center justify-center p-8">
		Not found {data.exchangeId}
	</div>
{/if}
