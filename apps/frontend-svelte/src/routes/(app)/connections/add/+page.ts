import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { user } = await parent();

	if (!user) {
		redirect(307, '/login/');
	}

	return {
		user,
		labels: [
			{
				href: '/connections/',
				title: 'Manage Connections'
			},
			{
				href: '/connections/new/',
				title: 'Add',
				active: true
			}
		],
		showBreadcrumb: true
	};
};
