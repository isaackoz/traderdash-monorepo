import { browser } from '$app/environment';
import { getCookie, setCookie } from '$lib/utils/cookie';
import { writable, type Writable } from 'svelte/store';

export const cookieStore = (
	key: string,
	initial: string | null = null
): Writable<string | null> => {
	let currentVal = initial;

	const { set: setStore, ...readableStore } = writable<string | null>(initial, () => {
		if (browser) {
			const cookieValue = getCookie('consent');
			set(cookieValue);
			return () => null;
		} else {
			return () => null;
		}
	});

	const set = (value: string | null) => {
		currentVal = value;
		setStore(value);
		if (browser) {
			setCookie('consent', value);
		}
	};

	const update = (fn: (v: string | null) => string | null) => {
		set(fn(currentVal));
	};

	return { ...readableStore, set, update };
};
