<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	let { children }: { children: any } = $props();
</script>

<div class="flex w-full max-w-7xl flex-col space-y-4">
	{@render children()}
</div>
