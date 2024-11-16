import { browser } from '$app/environment';
import { doesSessionExist } from '$lib/auth';
import type { TAPIUserMeGet } from '@repo/shared-types';
import type { LayoutLoad } from './$types';
import { getUserData } from '$lib/api/user/get-user-info';

export const trailingSlash = 'always';
export const prerender = false;
export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
	// Check auth status
	let user: TAPIUserMeGet | null = null;
	console.log(user);
	let isAuth = false;
	if (browser) {
		isAuth = await doesSessionExist();
		try {
			user = await getUserData({ fetch });
			console.log(user);
		} catch {
			user = null;
		}
	}
	return {
		isAuth: isAuth,
		user: user
	};
};
