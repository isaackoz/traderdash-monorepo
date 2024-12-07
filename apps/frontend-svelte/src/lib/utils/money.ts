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
