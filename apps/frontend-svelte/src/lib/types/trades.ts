import type { TradeSelect } from '@repo/db';
import type { Exchanges } from '@repo/exchange-info';
import type { Num, Str } from 'ccxt';

export type TradesItem = Omit<TradeSelect, 'userExchangeId'> & {
	exchangeId: Exchanges;
};

export type TradesTableRow = TradesItem & {
	calculatedPositionSize: number;
	calculatedAverageEntry: number;
};

export type AddTradeMeta = {
	trackType: 'automatic' | 'manual' | null;
	liveMarket: boolean | null;
	syncTrade: boolean;
};

export type AggregatedTrade = {
	aggregatedAmount: Num;
	order: Str;
	aggregatedCost: Num;
	aggregatedFees: Num;
	feeCurrency: Str;
	timestamp: Num;
	side: 'sell' | 'buy' | Str;
	takerOrMaker: 'taker' | 'maker' | Str;
	price: Num;
	symbol: Str;
};
