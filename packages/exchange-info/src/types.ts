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
     * Input description for API key
     */
    apiKeyDescription?: string;
    /**
     * Whether this exchange requires a secret
     */
    requireSecret: boolean;
    /**
     * Input description for secret
     */
    secretDescription?: string;
    /**
     * Whether this exchange requires a uid, or user id
     */
    requireUid: boolean;
    /**
     * Input description for uid
     */
    uidDescription?: string;
    /**
     * Whether this exchange requires a password
     */
    requirePassword: boolean;
    /**
     * Input description for password
     */
    passwordDescription?: string;
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
    /**
     * Proxy location for default proxy
     */
    proxyLocation: "USA" | "NETHERLANDS";
  };
};

export type ExchangeConfigs = Record<Exchanges, ExchangeConfig>;
