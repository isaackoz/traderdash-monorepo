export abstract class BasicRestClient {
  public hasTickers: boolean;
  public hasTrades: boolean;
  public hasTradeHistory: boolean;

  constructor(
    readonly apiUrl: string,
    readonly name: string
  ) {
    this.hasTickers = false;
    this.hasTrades = false;
    this.hasTradeHistory = false;
  }

  public getTradeHistory = async (asset: string) => {
    if (!this.hasTradeHistory) return;
    return this._getTradeHistory(asset);
  };

  public checkApiStatus = async () => {
    return this._checkApiStatus();
  };

  protected abstract _getTradeHistory(asset: string): Promise<any>;

  protected abstract _checkApiStatus(): Promise<boolean>;
}
