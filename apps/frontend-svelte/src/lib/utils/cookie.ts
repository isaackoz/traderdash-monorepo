export function getCookie(name: string) {
	const match = document.cookie.match(RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
	return match ? match[1] : null;
}

export function setCookie(
	name: string,
	value: string | null,
	days: number = 365,
	path: string = '/'
) {
	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Expiration date
	const expires = 'expires=' + date.toUTCString();
	document.cookie = `${name}=${encodeURIComponent(value ?? '')}; ${expires}; path=${path}; Secure; SameSite=Lax`;
}
