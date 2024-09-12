import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return {
		showBreadcrumb: true,
		label: 'My Trades'
	};
};
