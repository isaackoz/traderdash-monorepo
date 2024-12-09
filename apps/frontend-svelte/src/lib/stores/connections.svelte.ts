/**
 * Store connections
 */

import type { CCXTConnections } from '$lib/types/constants';
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
