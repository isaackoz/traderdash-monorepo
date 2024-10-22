export type Market = {
  id: string;
  base: string;
  quote: string;
  type?: string;
};

export type MarketMap = Map<string, Market>;

export type RestClientOptions = {
  apiUrl: string;
};
