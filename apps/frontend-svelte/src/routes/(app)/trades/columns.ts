import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { TradesTableRow } from '$lib/types/trades';
import { getExchangeName } from '$lib/utils/exchange';
import type { ColumnDef } from '@tanstack/table-core';
import PriceCell from './_components/price-cell.svelte';
import PnlCell from './_components/pnl-cell.svelte';
import TradeAction from './_components/trade-action.svelte';
import DataTableReusableColHeader from '$lib/components/ui/data-table/data-table-reusable-col-header.svelte';
import DirCell from './_components/dir-cell.svelte';
import { createRawSnippet } from 'svelte';

export const tradesColumns: ColumnDef<TradesTableRow>[] = [
	{
		accessorKey: 'marketSymbol',
		header: ({ column }) => {
			return renderComponent(DataTableReusableColHeader<TradesTableRow, unknown>, {
				column,
				title: 'Market Symbol'
			});
		},
		cell: ({ row }) => {
			const cellSnippet = createRawSnippet<[string]>((marketSymbol) => {
				const market = marketSymbol();
				return {
					render: () => `<div class="font-bold">${market}</div>`
				};
			});
			return renderSnippet(cellSnippet, row.getValue('marketSymbol'));
		}
	},
	{
		accessorKey: 'exchangeId',
		header: ({ column }) => {
			return renderComponent(DataTableReusableColHeader<TradesTableRow, unknown>, {
				column,
				title: 'Exchange'
			});
		},
		cell: ({ row }) => getExchangeName(row.original.exchangeId)
	},
	{
		accessorKey: 'type',
		header: ({ column }) => {
			return renderComponent(DataTableReusableColHeader<TradesTableRow, unknown>, {
				column,
				title: 'Status'
			});
		}
	},
	{
		accessorKey: 'direction',
		header: ({ column }) => {
			return renderComponent(DataTableReusableColHeader<TradesTableRow, unknown>, {
				column,
				title: 'Dir'
			});
		},
		cell: ({ row }) => {
			return renderComponent(DirCell, { dir: row.original.direction });
		}
	},
	{
		accessorKey: 'calculatedPositionSize',
		header: ({ column }) => {
			return renderComponent(DataTableReusableColHeader<TradesTableRow, unknown>, {
				column,
				title: 'Pos Size'
			});
		}
	},
	{
		accessorKey: 'calculatedAverageEntry',
		header: ({ column }) => {
			return renderComponent(DataTableReusableColHeader<TradesTableRow, unknown>, {
				column,
				title: 'Avg Entry'
			});
		}
	},
	{
		id: 'price',
		header: ({ column }) => {
			return renderComponent(DataTableReusableColHeader<TradesTableRow, unknown>, {
				column,
				title: 'Price'
			});
		},
		cell: ({ row }) => {
			return renderComponent(PriceCell, {
				exchangeId: row.original.exchangeId,
				marketSymbol: row.original.marketSymbol,
				quote: row.original.tickerQuote
			});
		}
	},
	{
		id: 'pnl',
		header: 'PNL',
		cell: ({ row }) => {
			return renderComponent(PnlCell, row.original);
		}
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(TradeAction, { id: row.original.id });
		},
		enableHiding: false
	}
];

export const colTypes = [
	{
		value: 'SPOT',
		label: 'SPOT'
	}
];
