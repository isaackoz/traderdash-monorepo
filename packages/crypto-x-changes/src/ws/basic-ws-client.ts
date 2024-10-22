import { EventEmitter } from "events";
import type { Market, MarketMap } from "../types";
import { SmartWss } from "../smart-wss";
import { Watcher } from "./watcher";

export type WssFactoryFn = (path: string) => SmartWss;
export type SendFn = (remoteId: string, market: Market) => void;

export abstract class BasicWsClient extends EventEmitter {
  public hasTickers: boolean;
  public hasTrades: boolean;
  public hasCandles: boolean;
  public hasLevel2Snapshots: boolean;
  public hasLevel2Updates: boolean;
  public hasLevel3Snapshots: boolean;
  public hasLevel3Updates: boolean;

  protected _wssFactory: WssFactoryFn;
  protected _tickerSubs: MarketMap;
  protected _tradeSubs: MarketMap;
  protected _candleSubs: MarketMap;
  protected _level2SnapshotSubs: MarketMap;
  protected _level2UpdateSubs: MarketMap;
  protected _level3SnapshotSubs: MarketMap;
  protected _level3UpdateSubs: MarketMap;
  protected _wss: SmartWss | undefined;
  protected _watcher: Watcher;

  constructor(
    readonly wssUrl: string,
    readonly name: string,
    wssFactory?: WssFactoryFn,
    watcherMs?: number
  ) {
    super();
    this._tickerSubs = new Map();
    this._tradeSubs = new Map();
    this._candleSubs = new Map();
    this._level2SnapshotSubs = new Map();
    this._level2UpdateSubs = new Map();
    this._level3SnapshotSubs = new Map();
    this._level3UpdateSubs = new Map();
    this._wss = undefined;
    this._watcher = new Watcher(this, watcherMs);

    this.hasTickers = false;
    this.hasTrades = true;
    this.hasCandles = false;
    this.hasLevel2Snapshots = false;
    this.hasLevel2Updates = false;
    this.hasLevel3Snapshots = false;
    this.hasLevel3Updates = false;
    this._wssFactory = wssFactory || ((path) => new SmartWss(path));
  }

  protected _connect() {
    if (!this._wss) {
    }
  }

  protected _onError(err) {
    this.emit("error", err);
  }

  protected _onConnecting() {
    this.emit("connecting");
  }

  protected _onConnected() {
    this.emit("connected");
  }

  protected _onDisconnected() {
    this.emit("disconnected");
  }

  protected _onClosing() {
    this.emit("closing");
  }
  protected _beforeConnect() {}

  protected _beforeClose() {}

  protected _onClosed() {
    this.emit("closed");
  }

  // Abstract
  protected abstract _onMessage(msg: any);
}
