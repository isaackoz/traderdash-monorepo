<script lang="ts">
	import CloudflareImage from '$lib/components/image/cloudflare-image.svelte';
	import { connectionsState } from '$stores/connections.svelte';
	import { exchangeConfigs } from '@repo/exchange-info';
</script>

<div class="">
	<h3 class=" font-semibold">Pick your connection</h3>
	<div class="mt-2 flex flex-col">
		<ul class="space-y-2">
			{#each connectionsState as [id, connection]}
				<li
					class="bg-muted hover:bg-muted-foreground/10 flex h-14 w-full rounded-xl transition-all hover:cursor-pointer"
				>
					<div class="p-2">
						<CloudflareImage
							imgId={exchangeConfigs[connection.data.exchangeId].imageId}
							variant="32"
							className="object-contain h-full w-full"
						/>
					</div>
					<div class="ml-4 flex h-full items-center font-bold">
						{connection.data.nickname}
					</div>
				</li>
			{/each}
		</ul>
		<div></div>
	</div>
</div>
