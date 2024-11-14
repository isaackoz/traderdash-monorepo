import type { PageLoad } from './$types';
import { exchanges, type Exchanges } from '@repo/exchange-info';
export const load: PageLoad = async ({ params, parent }) => {
	const { user } = await parent();

	const exchangeId = (exchanges as ReadonlyArray<string>).includes(params.exchange)
		? (params.exchange as Exchanges)
		: undefined;
	console.log('EID IS', exchangeId);

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
