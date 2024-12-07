import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { getExchangeConnections } from '$lib/api/user/exchange/get-exchange-connections';
import { QueryClient } from '@tanstack/svelte-query';
import { browser } from '$app/environment';
import type { TAPIUserExchangeGet } from '@repo/shared-types';
import { connectionsState } from '$stores/connections.svelte';
import ccxt from 'ccxt';

export const load: LayoutLoad = async ({ parent, url }) => {
	const { user, isAuth } = await parent();

	if (!isAuth && !user) {
		redirect(307, '/login/');
	}
	if (user && !user.onBoardingComplete && url.pathname !== '/onboarding/') {
		redirect(307, '/onboarding/');
	}

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	// Pre-fetch the user's exchange connections.
	// Since it will be used on most/all pages, it's best to do it here
	await queryClient.prefetchQuery({
		queryKey: ['connections'], // <---- it can be accessed using this key
		queryFn: async (): Promise<TAPIUserExchangeGet[]> => {
			const { data, error } = await getExchangeConnections();
			if (error) {
				throw new Error(error.message);
			}
			return data ?? [];
		}
	});

	// Initialize all connections into a global state
	const data = queryClient.getQueryData<TAPIUserExchangeGet[]>(['connections']);

	data?.forEach(async (connection) => {
		// Initialize connections here
		if (connection.exchangeId === 'traderdash') {
			return;
		}
		// Create a CCXT class for each connection
		const exchangeConnection = new ccxt.pro[connection.exchangeId]({
			proxy: 'http://localhost2.test:8080/',
			apiKey: connection.apiKey,
			secret: connection.secret?.replace(/\\n/g, '\n').trim(),
			uid: connection.uid,
			password: connection.password
		});

		connectionsState.set(connection.id, {
			data: connection,
			ccxtExchanges: exchangeConnection
		});
	});

	return { user, queryClient };
};
