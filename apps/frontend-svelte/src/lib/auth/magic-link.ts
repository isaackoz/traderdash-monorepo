import {
	clearLoginAttemptInfo,
	consumeCode,
	createCode,
	getLoginAttemptInfo,
	resendCode
} from 'supertokens-web-js/recipe/passwordless';

export async function sendMagicLink(email: string) {
	try {
		const response = await createCode({
			email
		});
		if (response.status === 'SIGN_IN_UP_NOT_ALLOWED') {
			window.alert(response.reason);
		} else {
			window.alert('Check your email');
		}
	} catch (err: unknown) {
		console.log(err);
	}
}

export async function resendMagicLink() {
	try {
		const response = await resendCode();
		if (response.status === 'RESTART_FLOW_ERROR') {
			await clearLoginAttemptInfo();
			window.alert('Login failed. Please try again');
			window.location.assign('/login');
		} else {
			window.alert('Please check your email for the magic link');
		}
	} catch (err: unknown) {
		console.log(err);
	}
}

export async function hasInitialMagicLinkBeenSent() {
	return (await getLoginAttemptInfo()) !== undefined;
}

export async function isThisSameBrowserAndDevice() {
	return (await getLoginAttemptInfo()) !== undefined;
}

export async function handleMagicLinkClicked() {
	try {
		const response = await consumeCode();
		if (response.status === 'OK') {
			await clearLoginAttemptInfo();
			if (response.createdNewRecipeUser && response.user.loginMethods.length === 1) {
				// user sign up success
			} else {
				// user sign in success
			}
		} else {
			await clearLoginAttemptInfo();
			window.alert('Login failed. Please try again');
			window.location.assign('/login');
		}
	} catch (err: unknown) {
		console.log(err);
	}
}
