import { exchanges } from ".";

export type Exchanges = (typeof exchanges)[number];

export type ExchangeConfig = {
  /**
   * A formatted display name.
   *
   * @example 'traderdash' -> 'TraderDash'
   */
  displayName: string;
  /**
   * A description describing this exchange
   */
  description: string;
  /**
   * Cloudflare image ID
   */
  imageId: string;

  authentication: {
    /**
     * Whether or not auth is enabled for this exchange
     */
    enabled: boolean;
    /**
     * Whether this exchange requires an API key
     */
    requireApiKey: boolean;
    /**
     * Whether this exchange requires a secret
     */
    requireSecret: boolean;
    /**
     * Whether this exchange requires a uid, or user id
     */
    requireUid: boolean;
    /**
     * Whether this exchange requires a password
     */
    requirePassword: boolean;
  };

  settings: {
    /**
     * This should be true for everything besides 'traderdash'
     */
    external: boolean;
    /**
     * Whether or not this exchange supports websockets
     */
    wsEnabled: boolean;
    /**
     * Whether or not this exchange supports rest api
     */
    restEnabled: boolean;
  };
};

export type ExchangeConfigs = Record<Exchanges, ExchangeConfig>;
