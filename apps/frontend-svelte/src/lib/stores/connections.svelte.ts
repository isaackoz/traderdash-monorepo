/**
 * Store connections
 */

import type { CCXTConnections } from '$lib/types/constants';
import type { TAPIUserExchangeGet } from '@repo/shared-types';

type Connection = {
	data: TAPIUserExchangeGet;
	ccxtExchanges: CCXTConnections;
};

export const connectionsState = $state<Map<number, Connection>>(new Map());
