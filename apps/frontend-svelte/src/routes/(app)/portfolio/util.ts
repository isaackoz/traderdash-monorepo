import type {
	PortfolioItem,
	AggregatedExchange,
	PortfolioTreemapNode,
	PortfolioTotal
} from '$lib/types/portfolio';
import type { Exchanges } from '@repo/exchange-info';

/**
 * Groups PortfolioItems by exchangeId.
 * @param items - Array of PortfolioItems
 * @returns A map where the key is the exchangeId and the value is an array of PortfolioItems.
 */
function groupByExchange(items: PortfolioItem[]): Record<Exchanges, PortfolioItem[]> {
	return items.reduce<Record<string, PortfolioItem[]>>((acc, item) => {
		if (!acc[item.exchangeId]) {
			acc[item.exchangeId] = [];
		}
		acc[item.exchangeId].push(item);
		return acc;
	}, {});
}

/**
 * Aggregates the total for each exchange.
 * @param groupedItems - Grouped PortfolioItems by exchangeId
 * @returns An array of aggregated totals for each exchange.
 */
function aggregateByExchange(groupedItems: Record<string, PortfolioItem[]>): AggregatedExchange[] {
	return Object.entries(groupedItems).map(([exchangeId, items]) => {
		const total = items.reduce((sum, item) => {
			if (item.type === 'fiat') {
				return (item.price ?? 0) + sum;
			}
			const itemValue = item.price !== null ? item.balance * item.price : 0;
			return sum + itemValue;
		}, 0);

		return {
			name: exchangeId,
			value: total
		};
	});
}

/**
 * Processes the PortfolioItems and returns totals by exchange.
 * @param items - Array of PortfolioItems
 * @returns An array of aggregated totals for each exchange.
 */
export function calculateTotalsByExchange(items: PortfolioItem[]): AggregatedExchange[] {
	const grouped = groupByExchange(items);
	return aggregateByExchange(grouped);
}

export function calculateWorth(
	balance: number,
	price: number | null,
	type: 'fiat' | 'coin'
): number {
	if (type === 'fiat') {
		return price ?? 0;
	}
	return price !== null ? balance * price : 0;
}

/**
 * Groups PortfolioItems into a treemap structure.
 * @param items - Array of PortfolioItems
 * @returns An array of TreemapNode for the treemap chart.
 */
export function buildTreemapData(items: PortfolioItem[]): PortfolioTreemapNode[] {
	const grouped = groupByExchange(items);

	// Map grouped items to a treemap-compatible format
	return Object.entries(grouped).map(([exchangeId, tickers]) => {
		const children = tickers.map((ticker) => ({
			name: ticker.ticker,
			value: ticker.price !== null ? ticker.balance * ticker.price : 0 // Worth of the ticker
		}));

		return {
			name: exchangeId, // Exchange as parent node
			children
		};
	});
}

export function calculatePortfolioTotal(items: PortfolioItem[]): PortfolioTotal {
	const grouped = groupByExchange(items);

	// get the total for each exchange individually
	const totalByExchange = Object.entries(grouped)
		.map(([exchangeId, items]): PortfolioTotal['totalByExchange'][0] => {
			const total = items.reduce((sum, item): number => {
				return sum + calculateWorth(item.balance, item.price, item.type);
			}, 0);

			return { exchangeId: exchangeId as Exchanges, total };
		})
		.sort((a, b) => b.total - a.total);

	const total = totalByExchange.reduce((sum, { total }) => sum + total, 0);

	return { total, totalByExchange };
}
