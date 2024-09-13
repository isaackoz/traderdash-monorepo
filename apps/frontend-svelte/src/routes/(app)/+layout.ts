import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const { isAuth } = await parent();

	if (!isAuth) {
		redirect(307, '/login/');
	}

	return { isAuth };
};
