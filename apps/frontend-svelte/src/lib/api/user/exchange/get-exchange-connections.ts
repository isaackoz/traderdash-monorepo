import type { TAPIUserExchangeGet } from '@repo/shared-types';
import type { TApiData } from '$lib/types/api';
import { PUBLIC_BACKEND_API } from '$env/static/public';

/**
 * Gets all of the user's exchange connections including their unencrypted exchange credentials
 */
export const getExchangeConnections = async (): Promise<TApiData<TAPIUserExchangeGet[]>> => {
	try {
		const res = await fetch(`${PUBLIC_BACKEND_API}/user/exchange`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (!res.ok) {
			return {
				error: {
					message: `Failed to get exchange connections: ${await res.text()}`
				}
			};
		}

		const data = (await res.json()) as TAPIUserExchangeGet[];
		return {
			data: data
		};
	} catch (e) {
		console.error(e);
		return {
			error: {
				message: 'Unknown error occured'
			}
		};
	}
};
