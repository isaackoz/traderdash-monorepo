export const formatCurrency = (
	value: string | number,
	{
		locale = 'en-US',
		intlCurrency = 'USD'
	}: {
		locale?: string;
		intlCurrency?: string;
	} = {} // Default to an empty object
): string => {
	return Intl.NumberFormat(locale, {
		style: 'currency',
		currency: intlCurrency
	}).format(Number(value));
};

const fiats: Record<string, string> = {
	USD: 'USD',
	USDT: 'USD',
	USDC: 'USD'
};
export const formatMarket = (value: string | number, quote: string): string => {
	if (fiats[quote]) {
		return formatCurrency(value, { intlCurrency: fiats[quote] });
	} else {
		return Number(value).toFixed(8);
	}
};
