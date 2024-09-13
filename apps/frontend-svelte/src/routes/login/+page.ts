import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const layout = await parent();

	if (layout.isAuth) {
		redirect(307, '/home/');
	}

	return { layout };
};
