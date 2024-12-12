<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		Table,
		TableBody,
		TableCaption,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { getExchangeName } from '$lib/utils/exchange';
	import type { PageData, PageLoad } from './$types';

	let { data }: { data: PageData } = $props();
	$inspect(data.connections);
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
		<Table>
			<TableCaption>{`${data?.connections?.length ?? '0'}  connections `}</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Exchange</TableHead>
					<TableHead>Nickname</TableHead>
					<TableHead>Date Added</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#if data.connections && data.connections.length > 0}
					{#each data.connections as connection}
						<TableRow>
							<TableCell>
								{getExchangeName(connection.exchangeId)}
							</TableCell>
							<TableCell>
								{connection.nickname}
							</TableCell>
							<TableCell>
								{new Date(connection.createdAt).toLocaleString()}
							</TableCell>
						</TableRow>
					{/each}
				{:else}{/if}
			</TableBody>
		</Table>
	</div>
</div>
