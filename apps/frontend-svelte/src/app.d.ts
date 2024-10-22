// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			showBreadcrumb?: boolean;
			labels?: {
				href: string;
				title: string;
				active?: boolean;
			}[];
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
