import type { TradeSelect } from '@repo/db';
import type { Exchanges } from '@repo/exchange-info';

export type TradesItem = Omit<TradeSelect, 'userExchangeId'> & {
	exchangeId: Exchanges;
};
