import type { AuthStore } from '$stores/global';
import type { Writable } from 'svelte/store';

export type User = {
	id: string;
};

export type AuthContext = {
	user: Writable<AuthStore> | null;
	signOut: () => Promise<void>;
};
