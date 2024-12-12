import { getTrades, tradesToTradeItems } from '$lib/api/user/trade';
import ccxt from 'ccxt';
import type { LayoutLoad } from './$types';
import type { CCXTExchanges } from '@repo/exchange-info/src/types';
import { getProxyUrlFromExchangeId } from '$lib/utils/exchange';
import { publicTradesWsState } from '$stores/connections.svelte';

export const load: LayoutLoad = async ({ parent, depends }) => {
	const { isAuth } = await parent();

	depends('trades:data');

	const { data, error } = await getTrades();
	if (error) {
		throw new Error(error.message);
	}

	// aggregate the trades and return a TradesItem[] array
	const myTrades = tradesToTradeItems(data);

	myTrades.exchangeWithTickers.forEach((exch) => {
		const exchangeId = exch.exchangeId as CCXTExchanges;
		const ccxtExchange = new ccxt.pro[exchangeId]({
			proxy: getProxyUrlFromExchangeId(exchangeId)
		});
		publicTradesWsState.connections.set(exch.exchangeId, ccxtExchange);
		publicTradesWsState.isLoaded = true;
	});

	return {
		isAuth,
		myTrades
	};
};
