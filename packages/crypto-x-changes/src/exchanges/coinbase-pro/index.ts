import { BasicClient } from "src/basic-client";
import { CoinbaseProRest } from "./coinbase-rest";

export class CoinbaseProClient extends BasicClient {
  constructor() {
    super(new CoinbaseProRest({ apiUrl: "coinbase.com" }));
  }
}
