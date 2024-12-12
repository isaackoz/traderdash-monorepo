/**
 * Store connections
 */

import type { CCXTConnections } from '$lib/types/constants';
import { type Exchanges } from '@repo/exchange-info';
import type { TAPIUserExchangeGet } from '@repo/shared-types';
import { SvelteMap } from 'svelte/reactivity';

type Connection = {
	data: TAPIUserExchangeGet;
	ccxtExchanges: CCXTConnections;
};

export const connectionsState = $state<{
	isLoaded: boolean;
	connections: SvelteMap<number, Connection>;
}>({
	isLoaded: false,
	connections: new SvelteMap()
});

export const publicTradesWsState = $state<{
	isLoaded: boolean;
	connections: SvelteMap<Omit<Exchanges, 'traderdash'>, CCXTConnections>;
}>({
	isLoaded: false,
	connections: new SvelteMap()
});
