<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="mx-auto max-w-screen-2xl p-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">Manage Connections</h1>
			<p class="text-primary/50 text-sm">Manage your connected exchanges</p>
		</div>
		<div>
			<Button href="/connections/add">+ New Connection</Button>
		</div>
	</div>
	<div class=" py-10"></div>
</div>
