import type { coinbase, binance, bybit, kraken } from 'ccxt';

export type CCXTConnections = coinbase | binance | bybit | kraken;

type FiatCurrencyProperties = {
	intlCurrency: string;
};

type FiatCurrencies = {
	[key: string]: FiatCurrencyProperties;
};
/**
 * Object list of fiat currencies. These can be used as either QUOTE or to ignore requests such as fetchTicker("USD/USD") which throws an error
 *
 * intlCurrency is what currency the value should resolve to, for example when using Intl.NumberFormat(..., {... currency: "USD"})
 */
export const fiatCurrencies: FiatCurrencies = {
	USD: {
		intlCurrency: 'USD'
	},
	USDT: {
		intlCurrency: 'USD'
	},
	USDC: {
		intlCurrency: 'USD'
	},
	EUR: {
		intlCurrency: 'EUR'
	}
};
