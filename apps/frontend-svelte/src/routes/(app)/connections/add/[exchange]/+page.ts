import type { PageLoad } from './$types';
export const load: PageLoad = async ({ params, parent }) => {
	const { user } = await parent();

	return {
		user,
		showBreadcrumb: true,
		labels: [
			{ title: 'Manage Connections', href: '/connections/' },
			{
				title: 'Add',
				href: '/connections/add/'
			},
			{
				title: `${params.exchange}`,
				href: `/connections/add/${params.exchange}`
			}
		]
	};
};
