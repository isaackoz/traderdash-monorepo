import { PUBLIC_BACKEND_API } from '$env/static/public';
import type { TAPICompleteOnboardingPOST } from '@repo/shared-types';

export const completeOnboarding = async (username: string) => {
	const res = await fetch(`${PUBLIC_BACKEND_API}/user/complete-onboarding`, {
		method: 'POST',
		body: JSON.stringify({ username }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = (await res.json()) as TAPICompleteOnboardingPOST;
	return data;
};
