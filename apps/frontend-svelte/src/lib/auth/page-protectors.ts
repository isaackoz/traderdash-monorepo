import { auth } from '$stores/global';
import Session from 'supertokens-web-js/recipe/session';

export async function doesSessionExist() {
	if (await Session.doesSessionExist()) {
		return true;
	} else {
		return false;
	}
}

export async function checkAuth() {
	try {
		const isSession = await doesSessionExist();

		if (isSession) {
			auth.set({
				isLoggedIn: true,
				userId: null
			});
		} else {
			auth.set({
				isLoggedIn: false,
				userId: null
			});
		}
	} catch (err: unknown) {
		console.log(err);
		auth.set({ isLoggedIn: false, userId: null });
	}
}
