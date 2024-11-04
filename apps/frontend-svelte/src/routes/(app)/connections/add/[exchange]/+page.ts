import { exchangeComponents, type ExchangeName } from '$lib/exchanges';
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ params, parent }) => {
	const { user } = await parent();

	const exchangeId =
		params.exchange in exchangeComponents ? (params.exchange as ExchangeName) : undefined;

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
		],
		exchangeId: exchangeId
	};
};
