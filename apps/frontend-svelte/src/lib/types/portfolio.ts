import type { Exchanges } from '@repo/exchange-info';

export type PortfolioItem = {
	ticker: string;
	balance: number;
	exchangeId: Exchanges;
	type: 'fiat' | 'coin';
	price: null | number;
	intlCurrency?: string;
};

export interface AggregatedExchange {
	name: string;
	value: number;
}

export interface PortfolioTreemapNode {
	name: string;
	value?: number; // Only leaf nodes (tickers) have a value
	children?: PortfolioTreemapNode[]; // Parent nodes (exchanges) have children
}
