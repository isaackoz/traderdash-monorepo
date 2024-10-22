<script lang="ts">
	import { Card, CardContent } from '../ui/card';

	let {
		id,
		description,
		displayName,
		imgUrl,
		imgBgColor,
		href
	}: {
		id: string;
		displayName: string;
		description: string;
		href: string;
		imgUrl?: string;
		imgBgColor?: string;
	} = $props();
</script>

<a {href}>
	<Card
		class="bg-muted hover:bg-muted/90 drop-shadow-xl  transition-all ease-out hover:cursor-pointer active:scale-[0.99]"
	>
		<CardContent class="mt-4">
			<div class="flex items-center space-x-2">
				<div class=" h-10 w-10 rounded-lg bg-stone-500">
					{#if imgUrl}
						<img
							src={imgUrl}
							alt={`${displayName} Logo`}
							width="32"
							height="32"
							class="object-contain"
						/>
					{/if}
				</div>
				<h3 class="text-lg font-bold">
					{displayName}
				</h3>
			</div>
			<div class="mt-4 h-10">
				<p class="text-primary/90 line-clamp-2 text-sm">{description}</p>
			</div>
		</CardContent>
	</Card>
</a>
