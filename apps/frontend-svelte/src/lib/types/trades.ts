import type { TradeSelect } from '@repo/db';
import type { Exchanges } from '@repo/exchange-info';

export type TradesItem = Omit<TradeSelect, 'userExchangeId'> & {
	exchangeId: Exchanges;
};

export type AddTradeMeta = {
	trackType: 'automatic' | 'manual' | null;
	liveMarket: boolean | null;
	syncTrade: boolean;
};
