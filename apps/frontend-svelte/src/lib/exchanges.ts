import AddConnectionTraderdashCrypto from './components/exchanges/traderdash-crypto/add-connection-traderdash-crypto.svelte';
import AddConnectionCoinbasePro from './components/exchanges/coinbase-pro/add-connection-coinbase-pro.svelte';
import type { Component } from 'svelte';

export const exchangeNames = ['traderdash-crypto', 'coinbase-pro'] as const;
export type ExchangeName = (typeof exchangeNames)[number];

// Exchange connections
export const exchangeComponents: Record<ExchangeName, { addForm: Component }> = {
	'traderdash-crypto': {
		addForm: AddConnectionTraderdashCrypto
	},
	'coinbase-pro': {
		addForm: AddConnectionCoinbasePro
	}
};

export const exchangeDetails: Record<
	ExchangeName,
	{
		description: string;
		displayName: string;
	}
> = {
	'traderdash-crypto': {
		description: 'Traderdash Crypto is a cryptocurrency exchange.',
		displayName: 'TraderDash (Crypto)'
	},
	'coinbase-pro': {
		description: 'Coinbase Pro is a cryptocurrency exchange.',
		displayName: 'Coinbase Pro'
	}
};
