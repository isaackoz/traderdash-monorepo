import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import ThirdParty from 'supertokens-web-js/recipe/thirdparty';
import Passwordless from 'supertokens-web-js/recipe/passwordless';
import { browser } from '$app/environment';

export function initAuth() {
	if (browser) {
		SuperTokens.init({
			appInfo: {
				apiDomain: 'http://localhost:3000',
				apiBasePath: '/auth',
				appName: 'TraderDash'
			},
			recipeList: [Session.init(), Passwordless.init(), ThirdParty.init()]
		});
	}
}

export * from './magic-link';
export * from './page-protectors';
