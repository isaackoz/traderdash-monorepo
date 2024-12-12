// mock-node-net.js
export function isIP(address) {
	const ipv4Regex = /^(([0-9]{1,3}\.){3}[0-9]{1,3})$/;
	const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::)$/;

	if (ipv4Regex.test(address)) return 4;
	if (ipv6Regex.test(address)) return 6;
	return 0; // Not a valid IP
}
