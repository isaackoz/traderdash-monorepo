import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { TAPIUserExchangeGet } from '@repo/shared-types';

export const load: PageLoad = async ({ parent }) => {
	const { user, queryClient } = await parent();

	if (!user) {
		redirect(307, '/login/');
	}
	const connections = queryClient.getQueryData<TAPIUserExchangeGet[]>(['connections']);
	console.log('C-data', connections);

	return {
		user,
		labels: [{ href: '/connections/', title: 'Manage Connections' }],
		showBreadcrumb: true,
		connections: connections
	};
};
