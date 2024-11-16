import { browser } from '$app/environment';
import { PUBLIC_BACKEND_API } from '$env/static/public';
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

export const serverStatusStore = () => {
	const { subscribe, set } = writable<'alive' | 'dead'>();

	const fetchServerStatus = async () => {
		try {
			const res = await fetch(`${PUBLIC_BACKEND_API}/ping`);
			if (res.ok) {
				set('alive');
			} else {
				set('dead');
			}
		} catch {
			set('dead');
		}
	};

	fetchServerStatus();
	const interval = setInterval(fetchServerStatus, 1000 * 30);

	return {
		subscribe,
		stop: () => clearInterval(interval)
	};
};

type ExchangeInfo = {
	id: string;
};

/**
 * Exchange Connections Store
 * ---
 * This store will hold all the user's exchange connections sensitive data (mainly API keys)
 *
 */
export const exchangeConnectionsStore = (
	key: string,
	initial: Set<ExchangeInfo> | null
): Writable<Set<ExchangeInfo> | null> => {
	let currVal = initial;
	const { set: setStore, ...readableStore } = writable<Set<ExchangeInfo> | null>(initial);
	const set = (val: Set<ExchangeInfo> | null) => {
		currVal = val;
		setStore(val);
	};

	const update = (fn: (v: Set<ExchangeInfo> | null) => Set<ExchangeInfo> | null) => {
		set(fn(currVal));
	};
	return { ...readableStore, set, update };
};
