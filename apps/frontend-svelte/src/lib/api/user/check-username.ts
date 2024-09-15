import { PUBLIC_BACKEND_API } from '$env/static/public';
import type { TAPIUserCheckUsernamePOST } from '@repo/shared-types';

export const checkUsername = async (username: string) => {
	const res = await fetch(`${PUBLIC_BACKEND_API}/user/check-username?username=${username}`, {
		method: 'POST'
	});
	const data = (await res.json()) as TAPIUserCheckUsernamePOST;
	return data;
};
