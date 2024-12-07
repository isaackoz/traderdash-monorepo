import { type Exchanges, exchangeConfigs } from '@repo/exchange-info';

export const getExchangeName = (exchangeId: Exchanges): string => {
	return exchangeConfigs[exchangeId].displayName;
};
