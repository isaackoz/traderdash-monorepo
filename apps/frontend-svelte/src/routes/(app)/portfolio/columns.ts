import type { PortfolioItem } from '$lib/types/portfolio';
import type { ColumnDef } from '@tanstack/table-core';
import { calculateWorth } from './util';

export const columns: ColumnDef<PortfolioItem>[] = [
	{
		accessorKey: 'exchangeId',
		header: 'Exchange'
	},
	{
		accessorKey: 'ticker',
		header: 'Ticker'
	},
	{
		accessorKey: 'balance',
		header: 'Balance'
	},
	{
		accessorKey: 'price',
		header: 'Price',
		cell: ({ row }) => {
			return Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: row.original.intlCurrency ?? 'USD'
			}).format(row.original.price ?? -1);
		}
	},
	{
		id: 'value',
		accessorFn: ({ balance, price, type }) => calculateWorth(balance, price, type),
		header: 'Value',
		cell: ({ row, getValue }) => {
			return Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: row.original.intlCurrency ?? 'USD'
			}).format(getValue<number>() ?? -1);
		}
	}
];
