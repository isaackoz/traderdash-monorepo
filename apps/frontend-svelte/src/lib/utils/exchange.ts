import { type Exchanges, exchangeConfigs, proxyLocations } from '@repo/exchange-info';
import type { CCXTExchanges } from '@repo/exchange-info/src/types';
import type { TAPIUserExchangeGet } from '@repo/shared-types';

export const getExchangeName = (exchangeId: Exchanges): string => {
	return exchangeConfigs[exchangeId].displayName;
};

export function getProxyUrlFromConnection(connection: TAPIUserExchangeGet): string | null {
	if (connection.noProxy) {
		return null;
	}
	if (connection.proxyUrl && connection.proxyUrl !== '') {
		return connection.proxyUrl;
	}
	// else use the defaults
	const exchangeInfo = exchangeConfigs[connection.exchangeId];
	if (exchangeInfo.settings.proxyLocation === 'USA') {
		return proxyLocations.USA;
	} else if (exchangeInfo.settings.proxyLocation === 'NETHERLANDS') {
		return proxyLocations.NETHERLANDS;
	}

	return null;
}

export function getProxyUrlFromExchangeId(exchangeId: CCXTExchanges): string {
	const exchangeInfo = exchangeConfigs[exchangeId];
	if (exchangeInfo.settings.proxyLocation === 'USA') {
		return proxyLocations.USA;
	} else if (exchangeInfo.settings.proxyLocation === 'NETHERLANDS') {
		return proxyLocations.NETHERLANDS;
	}

	return '';
}
