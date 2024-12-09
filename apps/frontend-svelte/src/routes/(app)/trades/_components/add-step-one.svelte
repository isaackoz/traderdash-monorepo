<script lang="ts">
	import CloudflareImage from '$lib/components/image/cloudflare-image.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { type AddTradeMeta } from '$lib/types/trades';
	import { connectionsState } from '$stores/connections.svelte';
	import { exchangeConfigs } from '@repo/exchange-info';
	import type { AddTradeData } from '@repo/shared-schemas';
	import type { SuperForm, SuperFormData } from 'sveltekit-superforms/client';

	let {
		nextStep,
		form = $bindable(),
		addTradeMeta = $bindable()
	}: {
		nextStep: () => void;
		form: SuperForm<AddTradeData>;
		addTradeMeta: AddTradeMeta;
	} = $props();
	const { form: formData } = form;

	function handleSelection(connectionId: number) {
		$formData.exchangeConnectionId = connectionId;
		nextStep();
	}
</script>

<div class="flex flex-grow flex-col justify-between">
	<div class="">
		<h3 class="mb-2 font-semibold">Pick your connection</h3>
		<ScrollArea class="flex max-h-[600px] flex-col">
			<ul class=" space-y-2">
				{#if connectionsState.isLoaded}
					{#if connectionsState.connections.size > 0}
						{#each connectionsState.connections as [id, connection]}
							<li>
								<button
									class="bg-muted hover:bg-muted-foreground/10 flex h-14 w-full rounded-xl transition-all hover:cursor-pointer"
									onclick={() => handleSelection(id)}
									type="button"
								>
									<div class="p-2">
										<CloudflareImage
											imgId={exchangeConfigs[connection.data.exchangeId].imageId}
											variant="32"
											className="object-contain h-10 w-10"
										/>
									</div>
									<div class="ml-4 flex h-full items-center font-bold">
										{connection.data.nickname}
									</div>
								</button>
							</li>
						{/each}
					{:else}
						<div>You have no connections</div>
					{/if}
				{:else}
					<Skeleton class="h-14 w-full" />
				{/if}
			</ul>
		</ScrollArea>
	</div>
	<!-- <span class="flex-grow"></span> -->
	<div class="">
		<a href="/connections/add/" class="text-blue-500 underline underline-offset-4"
			>Add a new connection &rarr;</a
		>
	</div>
</div>
