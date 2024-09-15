import { PUBLIC_BACKEND_API } from '$env/static/public';
import { type TAPIUserMeGet } from '@repo/shared-types';
type APIResponse<T> =
	| {
			data: T;
			error?: null;
	  }
	| {
			data?: null;
			error: {
				type: 'server' | 'unknown' | 'unauthorized' | 'offline';
				message?: string;
			};
	  };

type APIOptions = {
	fetch?: typeof fetch;
};

export const getUserData = async (options?: APIOptions) => {
	console.log('Fetching data...');
	const res = options?.fetch
		? await options.fetch(`${PUBLIC_BACKEND_API}/user/me`)
		: await fetch(`${PUBLIC_BACKEND_API}/user/me`);
	const data = (await res.json()) as TAPIUserMeGet;
	return data;
};

export async function getUserInfo(): Promise<APIResponse<TAPIUserMeGet>> {
	try {
		const userDataTest = await fetch(`${PUBLIC_BACKEND_API}/user/me`, {
			method: 'GET'
		});

		if (!userDataTest.ok) {
			return {
				error: {
					type: 'server',
					message: 'Failed to fetch user info'
				}
			};
		}

		return {
			data: (await userDataTest.json()) as TAPIUserMeGet
		};
	} catch {
		return {
			error: {
				type: 'server'
			}
		};
	}
}
