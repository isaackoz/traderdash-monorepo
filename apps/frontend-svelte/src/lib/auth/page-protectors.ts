import Session from 'supertokens-web-js/recipe/session';
import { getContext, hasContext } from 'svelte';
import { type AuthContext } from '../../types/auth';

export async function doesSessionExist() {
	if (await Session.doesSessionExist()) {
		return true;
	} else {
		return false;
	}
}

export async function checkAuth() {
	if (!hasContext('authContext')) {
		throw new Error('Must be used within layout context');
	}
	const { user } = getContext<AuthContext>('authContext');
	try {
		if (await doesSessionExist()) {
			user?.set({ user: { id: '1234' } });
		} else {
			user?.set({ user: null });
		}
	} catch {
		user?.set({ user: null });
	}
}

// export async function checkAuth() {
// 	try {
// 		const isSession = await doesSessionExist();

// 		if (isSession) {
// 			auth.set({
// 				isLoggedIn: true,
// 				userId: null
// 			});
// 		} else {
// 			auth.set({
// 				isLoggedIn: false,
// 				userId: null
// 			});
// 		}
// 	} catch (err: unknown) {
// 		console.log(err);
// 		auth.set({ isLoggedIn: false, userId: null });
// 	}
// }
