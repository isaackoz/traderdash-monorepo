import { doesSessionExist } from '$lib/auth';
import type { LayoutLoad } from './$types';

export const trailingSlash = 'always';
export const prerender = false;
export const ssr = false;

export const load: LayoutLoad = async () => {
	// Check auth status
	const isAuth = await doesSessionExist();
	return {
		isAuth: isAuth
	};
};
