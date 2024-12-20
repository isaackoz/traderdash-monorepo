<script lang="ts">
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		type ColumnFiltersState,
		type VisibilityState,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { TradesItem, TradesTableRow } from '$lib/types/trades';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import { colTypes, tradesColumns } from './columns';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Settings2Icon } from 'lucide-svelte';
	import DataTableRPagination from '$lib/components/ui/data-table/data-table-r-pagination.svelte';
	import DataTableRFacFilter from '$lib/components/ui/data-table/data-table-r-fac-filter.svelte';
	import { tableStateStore } from '$stores/table-state.svelte';

	let { data, isLoading = false }: { data: TradesTableRow[]; isLoading: boolean } = $props();

	let { sorting, pagination, columnVisibility, columnFilters } = tableStateStore({
		id: 'trades'
	});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns: tradesColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnVisibility() {
				return columnVisibility;
			}
		}
	});

	//
	const isFiltered = $derived(table.getState().columnFilters.length > 0);
	const typeCol = $derived(table.getColumn('status'));
	const priorityCol = $derived(table.getColumn(''));
</script>

<div>
	<div class="my-4 flex items-center justify-between">
		<div class="flex flex-1 items-center space-x-2">
			<Input
				placeholder="Filter by symbol"
				value={table.getColumn('marketSymbol')?.getFilterValue() as string}
				onchange={(e) => table.getColumn('marketSymbol')?.setFilterValue(e.currentTarget.value)}
				oninput={(e) => table.getColumn('marketSymbol')?.setFilterValue(e.currentTarget.value)}
				class="max-w-xs"
			/>
			{#if typeCol}
				<DataTableRFacFilter column={typeCol} title="Type" options={colTypes} />
			{/if}
		</div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" class="ml-auto">
						<Settings2Icon class="size-4" />
						<span> View </span>
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
					<DropdownMenu.CheckboxItem
						class="capitalize"
						controlledChecked
						checked={column.getIsVisible()}
						onCheckedChange={(value) => column.toggleVisibility(!!value)}
					>
						{column.id}
					</DropdownMenu.CheckboxItem>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<div class=" mb-4 rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#if isLoading}
					<Table.Row class="col-span-full [&>td:nth-last-child(2)]:w-full">
						<Table.Cell colspan={999} class="relative h-14 p-1">
							<p
								class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center"
							>
								Loading data from your connections...
							</p>
							<Skeleton class="h-full w-full" />
						</Table.Cell>
					</Table.Row>
				{:else}
					{#each table.getRowModel().rows as row (row.id)}
						<Table.Row
							data-state={row.getIsSelected() && 'selected'}
							class="[&>td:nth-last-child(2)]:w-full"
						>
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell>
									<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={99} class="h-24 text-center">No results.</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
	<DataTableRPagination {table} />
</div>
