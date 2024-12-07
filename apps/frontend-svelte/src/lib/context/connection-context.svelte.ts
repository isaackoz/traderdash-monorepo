import { type TAPIUserExchangeGet } from '@repo/shared-types';
import { getContext, setContext } from 'svelte';

type InitConnectionState = {
	initConnections: TAPIUserExchangeGet[];
};

export class ConnectionState {
	connections = $state<TAPIUserExchangeGet[]>([]);
	connectionStatus = $state<Map<number, 'ALIVE' | 'DEAD'>>(new Map());

	constructor({ initConnections }: InitConnectionState) {
		this.connections = initConnections;
	}

	// Check each connection the user has
	async checkConnections() {}
}

const CONNECTION_KEY = Symbol('CONNECTIONS');

export function setConnectionState(props: InitConnectionState) {
	return setContext(CONNECTION_KEY, new ConnectionState(props));
}

export function getConnectionState() {
	return getContext<ReturnType<typeof setConnectionState>>(CONNECTION_KEY);
}
