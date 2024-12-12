import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { user } = await parent();

	if (!user) {
		redirect(307, '/login/');
	}

	// Get connections

	return {
		user,
		labels: [{ href: '/portfolio/', title: 'Portfolio', active: true }],
		showBreadcrumb: true
	};
};
