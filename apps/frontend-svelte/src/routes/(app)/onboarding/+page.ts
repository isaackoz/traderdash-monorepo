import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { user } = await parent();

	if (!user) {
		redirect(307, '/login/');
	}
	if (user.onBoardingComplete) {
		redirect(307, '/home/');
	}

	return { user, label: 'Onboarding', showBreadcrumb: true };
};
