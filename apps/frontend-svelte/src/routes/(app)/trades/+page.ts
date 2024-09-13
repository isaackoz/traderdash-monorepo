import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { isAuth } = await parent();
	return {
		isAuth,
		showBreadcrumb: true,
		label: 'My Trades'
	};
};
