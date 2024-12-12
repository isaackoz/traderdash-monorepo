import { renderComponent } from '$lib/components/ui/data-table';
import type { TradesTableRow } from '$lib/types/trades';
import { getExchangeName } from '$lib/utils/exchange';
import type { ColumnDef } from '@tanstack/table-core';
import PriceCell from './_components/price-cell.svelte';
import PnlCell from './_components/pnl-cell.svelte';

export const tradesColumns: ColumnDef<TradesTableRow>[] = [
	{
		accessorKey: 'marketSymbol',
		header: 'Market'
	},
	{
		accessorKey: 'exchangeId',
		header: 'Exchange',
		cell: ({ row }) => getExchangeName(row.original.exchangeId)
	},
	{
		accessorKey: 'type',
		header: 'Type'
	},
	{
		accessorKey: 'direction',
		header: 'Direction'
	},
	{
		accessorKey: 'calculatedPositionSize',
		header: 'Position Size'
	},
	{
		accessorKey: 'calculatedAverageEntry',
		header: 'Average Entry'
	},
	{
		id: 'price',
		header: 'Price',
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
		id: 'actions'
	}
];
