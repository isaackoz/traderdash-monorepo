/**
 * Store connections
 */

import type { CCXTConnections } from '$lib/types/constants';
import type { TAPIUserExchangeGet } from '@repo/shared-types';

type Connection = {
	data: TAPIUserExchangeGet;
	ccxtExchanges: CCXTConnections;
};

export const connectionsState = $state<{
	isLoaded: boolean;
	connections: Map<number, Connection>;
}>({
	isLoaded: false,
	connections: new Map()
});
