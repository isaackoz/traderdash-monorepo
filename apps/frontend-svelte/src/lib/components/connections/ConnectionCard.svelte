<script lang="ts">
	import CloudflareImage from '../image/cloudflare-image.svelte';
	import { Card, CardContent } from '../ui/card';

	let {
		id,
		description,
		displayName,
		imgId,
		imgBgColor,
		href
	}: {
		id: string;
		displayName: string;
		description: string;
		href: string;
		imgId?: string;
		imgBgColor?: string;
	} = $props();
</script>

<a {href}>
	<Card
		class="bg-muted hover:bg-muted/90 drop-shadow-xl  transition-all ease-out hover:cursor-pointer active:scale-[0.99]"
	>
		<CardContent class="">
			<div class="flex items-center space-x-4">
				<div class="h-10 w-10 rounded-lg">
					{#if imgId}
						<CloudflareImage {imgId} variant="32" className="object-contain h-full w-full" />
					{/if}
				</div>
				<h3 class="text-xl font-bold">
					{displayName}
				</h3>
			</div>
			<div class="mt-4">
				<p class="text-primary/90 line-clamp-2 text-sm">{description}</p>
			</div>
		</CardContent>
	</Card>
</a>
