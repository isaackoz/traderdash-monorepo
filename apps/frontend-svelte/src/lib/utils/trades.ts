import type { AggregatedTrade } from '$lib/types/trades';
import type { TradeItemSelect } from '@repo/db';
import type { Trade } from 'ccxt';

export function getTotalPositionSize(trades: TradeItemSelect[]): number {
	return trades.reduce((total, trade) => {
		if (trade.side === 'buy') {
			return total + parseFloat(trade.amount);
		} else if (trade.side === 'sell') {
			return total - parseFloat(trade.amount);
		}
		return total;
	}, 0);
}

export function getAverageEntryPrice(trades: TradeItemSelect[]): number {
	let totalAmount = 0;
	let totalCost = 0;

	for (const trade of trades) {
		const amount = parseFloat(trade.amount);
		const price = parseFloat(trade.entryPrice);

		if (trade.side === 'buy') {
			totalCost += amount * price;
			totalAmount += amount;
		} else if (trade.side === 'sell') {
			totalCost -= amount * price;
			totalAmount -= amount;
		}
	}

	return totalAmount === 0 ? 0 : totalCost / totalAmount;
}

export function getAggregatedTrades(trades: Trade[]): AggregatedTrade[] {
	// Group trades together by "order"
	const groupedTrades = trades.reduce((grouped: Record<string, Trade[]>, trade) => {
		if (trade.order) {
			if (!grouped[trade.order]) {
				grouped[trade.order] = [];
			}
			grouped[trade.order].push(trade);
		}
		return grouped;
	}, {});

	const aggregatedTrades: AggregatedTrade[] = Object.entries(groupedTrades).map(
		([order, group]) => {
			const aggregatedAmount = group.reduce((sum, trade) => sum + Number(trade.amount), 0);
			const aggregatedCost = group.reduce((sum, trade) => sum + Number(trade.cost), 0);
			const aggregatedFees = group.reduce((sum, trade) => sum + (trade.fee?.cost || 0), 0);

			// Use the first trade in the group for static fields
			const { fee, timestamp, side, takerOrMaker, price, symbol } = group[0];

			return {
				aggregatedAmount,
				order,
				aggregatedCost,
				aggregatedFees,
				feeCurrency: fee?.currency || undefined,
				timestamp,
				side: side || '',
				takerOrMaker: takerOrMaker || '',
				price, // First trade's price
				symbol: symbol || ''
			};
		}
	);
	return aggregatedTrades;
}
