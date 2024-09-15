import {
	clearLoginAttemptInfo,
	consumeCode,
	createCode,
	getLoginAttemptInfo,
	resendCode
} from 'supertokens-web-js/recipe/passwordless';

export async function sendMagicLink(
	email: string,
	options: {
		isSignUp: boolean;
	} = {
		isSignUp: false
	}
) {
	try {
		const response = await createCode({
			email,
			userContext: {
				isSignUp: options.isSignUp
			}
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

type THandleMagicLinkClicked =
	| {
			success: true;
	  }
	| { success: false; reason: string };
export async function handleMagicLinkClicked(): Promise<THandleMagicLinkClicked> {
	try {
		const response = await consumeCode();
		console.log(response);
		if (response.status === 'OK') {
			await clearLoginAttemptInfo();
			if (response.createdNewRecipeUser && response.user.loginMethods.length === 1) {
				// If the user is new and signing up
				return {
					success: true
				};
			} else {
				return {
					success: true
				};
			}
		} else {
			await clearLoginAttemptInfo();
			let status: string = 'Unknown error. Try again.';
			switch (response.status) {
				case 'SIGN_IN_UP_NOT_ALLOWED': {
					status = 'Sign up is not allowed at this time.';
					break;
				}
				case 'EXPIRED_USER_INPUT_CODE_ERROR': {
					status = 'The link you clicked has expired. Try again.';
					break;
				}
				case 'INCORRECT_USER_INPUT_CODE_ERROR': {
					status = 'The link you clicked was invalid. Try again.';
					break;
				}
				case 'RESTART_FLOW_ERROR': {
					status = 'This link has already been used. Try again.';
				}
			}
			return {
				success: false,
				reason: status
			};
		}
	} catch (err: unknown) {
		console.log(err);
		return {
			success: false,
			reason: 'Server error. Try again later.'
		};
	}
}
