import { BasicRestClient } from "src/rest/basic-rest-client";
import { RestClientOptions } from "src/types";
import { wait } from "src/utils";

export class CoinbaseProRest extends BasicRestClient {
  constructor({ apiUrl }: RestClientOptions) {
    super(apiUrl, "CoinbasePro");
    this.hasTradeHistory = true;
    this.hasTickers = true;
    this.hasTrades = true;
  }

  //

  protected async _checkApiStatus(): Promise<boolean> {
    // TODO fix
    await wait(1000);
    return true;
  }

  protected async _getTradeHistory(asset: string): Promise<any> {
    // TODO implement
    return true;
  }
}
