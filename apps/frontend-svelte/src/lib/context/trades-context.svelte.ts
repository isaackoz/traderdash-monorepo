import { publicTradesWsState } from '$stores/connections.svelte';
import type { Exchanges } from '@repo/exchange-info';
import type { Ticker } from 'ccxt';
import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

type InitTradesState = {
	todo: string;
};

export class TradesState {
	wsConnections = $derived(publicTradesWsState.connections);
	wsConnectionsLoaded = $derived(publicTradesWsState.isLoaded);
	prices = $state<SvelteMap<string, Ticker>>(new SvelteMap());

	constructor(props: InitTradesState) {
		//
		console.log(props);
	}

	watchTickers(exchange: Exchanges, symbols: string[]) {
		let watch = true;
		const stopWatching = () => {
			console.info('Stopping');
			watch = false;
			if (this.wsConnections.get(exchange)?.has['unWatchTickers']) {
				this.wsConnections.get(exchange)?.unWatchTickers();
			}
		};
		// run a while true in the background
		(async () => {
			while (watch) {
				try {
					const tickers = await this.wsConnections.get(exchange)?.watchTickers(symbols);
					// console.log(Date.now(), exchange, tickers);
					if (tickers) {
						Object.entries(tickers).forEach(([symbol, ticker]) => {
							this.prices.set(`${exchange}-${symbol}`, ticker);
						});
					}
					// Set the result

					// Wait 1s to avoid performance issues
					await new Promise((resolve) => setTimeout(resolve, 1000));
				} catch (e) {
					console.error(e);
					console.info('Attempting to reconnect');
				}
			}
		})();

		// Fetch the initial tickers
		(async () => {
			try {
				if (symbols.length === 0) return;
				const initialTickers = await this.wsConnections.get(exchange)?.fetchTickers(symbols);
				if (initialTickers) {
					Object.entries(initialTickers).forEach(([symbol, ticker]) => {
						this.prices.set(`${exchange}-${symbol}`, ticker);
					});
				}
			} catch (e) {
				console.error("Couldn't fetch initial tickers", e);
				// Do nothing if it fails
			}
		})();

		return stopWatching;
	}
}

const TRADES_KEY = Symbol('TRADES');

export function setTradesState(props: InitTradesState) {
	return setContext(TRADES_KEY, new TradesState(props));
}

export function getTradesState() {
	return getContext<ReturnType<typeof setTradesState>>(TRADES_KEY);
}
