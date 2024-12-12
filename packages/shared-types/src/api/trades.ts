import type { TradeItemSelect, TradeSelect } from "@repo/db";
import type { Exchanges } from "../../../exchange-info/src";

export type TAPIUserTradesGet = TradeSelect & {
  exchangeId: Exchanges;
  tradeItems: TradeItemSelect[];
};
