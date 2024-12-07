import type { PortfolioItem } from '$lib/types/portfolio';
import type { ColumnDef } from '@tanstack/table-core';

export const portfolioColumns: ColumnDef<PortfolioItem>[] = [
	{
		accessorKey: 'exchangeId',
		header: 'Exchange Id'
	},
	{
		accessorKey: 'ticker',
		header: 'Ticker'
	},
	{
		accessorKey: 'balance',
		header: 'Balance'
	}
];
