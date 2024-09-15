import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, url }) => {
	const { user } = await parent();

	if (!user) {
		redirect(307, '/login/');
	}
	if (!user.onBoardingComplete && url.pathname !== '/onboarding/') {
		redirect(307, '/onboarding/');
	}

	return { user };
};
