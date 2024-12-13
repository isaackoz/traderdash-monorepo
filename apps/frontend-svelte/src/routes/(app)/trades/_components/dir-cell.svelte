<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	let { dir }: { dir: 'buy' | 'sell' | null } = $props();
</script>

{#if dir === 'buy'}
	<Badge variant="outline" class="bg-green-950 px-3 py-1">Long</Badge>
{:else if dir === 'sell'}
	<Badge variant="outline" class="bg-red-950 px-3 py-1">Short</Badge>
{:else}
	<Badge variant="outline">N/A</Badge>
{/if}
