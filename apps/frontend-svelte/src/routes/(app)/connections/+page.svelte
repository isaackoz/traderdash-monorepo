<script lang="ts">
	import ConnectionCard from '$lib/components/connections/ConnectionCard.svelte';
	import ManageConnectionsTable from '$lib/components/connections/table/manage-connections-table.svelte';
	import PageHeader from '$lib/components/layout/common/PageHeader.svelte';
	import PageWrapper from '$lib/components/layout/common/PageWrapper.svelte';
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
	<div class=" py-10">
		<ManageConnectionsTable />
	</div>
</div>
