<script lang="ts">
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';

	type Connection = {
		id: string;
		name: string;
		exchange: 'Coinbase' | 'Binance' | 'TraderDash';
		type: 'crypto';
		createdAt: Date;
		status: 'active' | 'error';
	};

	const data: Connection[] = [];

	const table = createTable(readable(data));

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: 'ID'
		}),
		table.column({
			accessor: 'name',
			header: 'Name'
		}),
		table.column({
			accessor: 'exchange',
			header: 'Exchange'
		}),
		table.column({
			accessor: 'type',
			header: 'Type'
		}),
		table.column({
			accessor: 'status',
			header: 'Status',
			cell: ({ value }) => (value === 'active' ? 'Active' : 'Error')
		}),
		table.column({
			accessor: 'createdAt',
			header: 'Created At',
			cell: ({ value }) => value.toDateString()
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs}>
									<Render of={cell.render()} />
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#if $pageRows.length === 0}
				<Table.Row>
					<Table.Cell colspan={$headerRows[0].cells.length} class="text-center"
						>You have no connections.</Table.Cell
					>
				</Table.Row>
			{:else}
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										<Render of={cell.render()} />
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			{/if}
		</Table.Body>
	</Table.Root>
</div>
