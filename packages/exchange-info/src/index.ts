// DO NOT STORE SECRETS OR SERVER SIDE STUFF HERE
// THIS DATA IS ACCESSIBLE TO FRONTEND USERS
import { ExchangeConfigs, ExchangeConfig, Exchanges } from "./types";
export type { ExchangeConfigs, ExchangeConfig, Exchanges };
/**
 * List of exchange IDs supported
 *
 * ---- IMPORTANT ----
 * ---
 * Make sure that the id you put below is exactly the id supported in ccxt
 * https://docs.ccxt.com/#/ccxt.pro.manual?id=exchanges
 *
 * With the exception of 'traderdash'
 *
 * ------------------
 * Technically every exchange should be compatible, but we need the intermediary config below to
 * determine what kind of authentication is required for each exchange and other settings.
 */
export const exchanges = [
  "traderdash",
  "coinbase",
  "bybit",
  "binance",
  "kraken",
] as const;

/**
 * Exchange Configs
 */
export const exchangeConfigs: ExchangeConfigs = {
  traderdash: {
    displayName: "TraderDash",
    imageId: "d48a58c0-5807-4daa-ce95-544e2144f500",
    description: "TraderDash is for manual inputs.",
    authentication: {
      enabled: false,
      requireApiKey: false,
      requirePassword: false,
      requireSecret: false,
      requireUid: false,
    },
    settings: {
      external: false,
      restEnabled: false,
      wsEnabled: false,
    },
  },
  bybit: {
    displayName: "Bybit",
    imageId: "d48a58c0-5807-4daa-ce95-544e2144f500",
    description: "Bybit is a cryptocurrency exchange.",
    authentication: {
      enabled: true,
      requireApiKey: true,
      requirePassword: false,
      requireSecret: true,
      requireUid: false,
    },
    settings: {
      external: true,
      restEnabled: true,
      wsEnabled: true,
    },
  },
  binance: {
    displayName: "Binance",
    imageId: "d48a58c0-5807-4daa-ce95-544e2144f500",
    description: "Binance is a cryptocurrency exchange.",
    authentication: {
      enabled: true,
      requireApiKey: true,
      requirePassword: false,
      requireSecret: true,
      requireUid: false,
    },
    settings: {
      external: true,
      restEnabled: true,
      wsEnabled: true,
    },
  },
  coinbase: {
    displayName: "Coinbase",
    imageId: "317f64c5-f985-4126-ae63-2db0774ecf00",
    description: "Coinbase is a cryptocurrency exchange.",
    authentication: {
      enabled: true,
      requireApiKey: true,
      requirePassword: true,
      requireSecret: true,
      requireUid: true,
    },
    settings: {
      external: true,
      restEnabled: true,
      wsEnabled: true,
    },
  },
  kraken: {
    displayName: "Kraken",
    imageId: "d48a58c0-5807-4daa-ce95-544e2144f500",
    description: "Kraken is a cryptocurrency exchange.",
    authentication: {
      enabled: true,
      requireApiKey: true,
      requirePassword: true,
      requireSecret: true,
      requireUid: true,
    },
    settings: {
      external: true,
      restEnabled: true,
      wsEnabled: true,
    },
  },
};