import type { TradesItem } from '$lib/types/trades';
import type { ColumnDef } from '@tanstack/table-core';

export const tradesColumns: ColumnDef<TradesItem>[] = [
	{
		accessorKey: 'tickerBase',
		header: 'Ticker'
	},
	{
		accessorKey: 'exchangeId',
		header: 'Exchange'
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
		id: 'positionSize',
		header: 'Position Size'
	},
	{
		id: 'avgEntry',
		header: 'Average Entry'
	},
	{
		id: 'pnl',
		header: 'PNL'
	}
];

export const mockTrades: TradesItem[] = [
	{
		id: 'a-1',
		direction: 'LONG',
		tickerBase: 'BTC',
		tickerQuote: 'USD',
		exchangeId: 'coinbase',
		type: 'SPOT'
	},
	{
		id: 'a-2',
		direction: 'LONG',
		tickerBase: 'ETH',
		tickerQuote: 'BTC',
		exchangeId: 'coinbase',
		type: 'SPOT'
	}
];
