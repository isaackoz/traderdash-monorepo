import { PUBLIC_BACKEND_API } from '$env/static/public';
import type { TApiData } from '$lib/types/api';
import type { AddUserExchangeData } from '@repo/shared-schemas';

export const addExchangeConnection = async (data: AddUserExchangeData): Promise<TApiData<null>> => {
	try {
		const res = await fetch(`${PUBLIC_BACKEND_API}/user/exchange`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (!res.ok) {
			return {
				error: {
					message: `Failed to add exchange connection: ${await res.text()}`
				}
			};
		}

		return {
			data: null
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
