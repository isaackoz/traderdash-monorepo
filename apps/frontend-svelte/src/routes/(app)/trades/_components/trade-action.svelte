<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import { ArrowRight } from 'lucide-svelte';

	let { id }: { id: string } = $props();
</script>

<Button class="relative" variant="outline" href={`/trades/${id}`}>
	<span class="">Details</span>
	<ArrowRight class="size-4" />
</Button>
