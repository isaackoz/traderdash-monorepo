import {
  bigint,
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { WithModificationDates } from "./util/with-modifitaction-dates";
import { usersTable } from "./user.schema";
import { exchanges } from "@repo/exchange-info";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userExchangeConnectionsTable = pgTable(
  "user_exchange_connection",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id),
    exchangeId: text("exchange_id", { enum: exchanges }).notNull(),

    // User specific customizations
    nickname: text("nickname").notNull(),

    // (for future use) Preferences will be a jsonb column to allow us to easily add/modify
    // user preferences during development.
    // TODO: Attach a type to this
    preferences: jsonb("preferences"),
    proxyUrl: text("proxy_url"),
    noProxy: boolean("no_proxy").default(false),

    // For auth. Note that all exchanges have different authentication methods, so leave these as nullable
    apiKeyHashed: text("api_key_h"),
    secretHashed: text("secret_h"),
    uidHashed: text("uid_h"),
    passwordHashed: text("password_h"),

    ...WithModificationDates,
  }
);

export type ExchangeConnectionSelect =
  typeof userExchangeConnectionsTable.$inferSelect;
export type ExchangeConnectionInsert =
  typeof userExchangeConnectionsTable.$inferInsert;

export const tradesTable = pgTable("trades", {
  id: uuid("id").primaryKey().defaultRandom(),
  userExchangeId: integer("user_exchange_id")
    .notNull()
    .references(() => userExchangeConnectionsTable.id),

  tickerBase: text("ticker_base").notNull(),
  tickerQuote: text("ticker_base").notNull(),
  marketSymbol: text("market_symbol").notNull(),

  fromTimestamp: bigint("from_timestamp", { mode: "number" }).notNull(),
  toTimestamp: bigint("to_timestamp", { mode: "number" }),

  // Whether to allow this trade to be syncable and update new trades on demand
  syncTrade: boolean("sync_trade").notNull(),
  // Whether or not to use websocket to get price
  liveMarket: boolean("live_market").notNull(),

  type: text("type", { enum: ["SPOT", "FUTURE", "OPTION"] }).notNull(),
  direction: text("direction", { enum: ["buy", "sell"] }),
});

export type TradeSelect = typeof tradesTable.$inferSelect;
export type TradeInsert = typeof tradesTable.$inferInsert;
export const insertTradeSchema = createInsertSchema(tradesTable);

// 1 trade table < --- > many trade_items
export const tradeItem = pgTable("trade_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  tradeId: uuid("trade_id")
    .notNull()
    .references(() => tradesTable.id),
  amount: numeric("amount", { precision: 20, scale: 8 }).notNull(),
  entryPrice: numeric("price", { precision: 20, scale: 8 }).notNull(),
  // cost can be derived by multiplying amount * price
  side: text("direction", { enum: ["buy", "sell"] }).notNull(),
  feeCost: numeric("fee_cost", { precision: 12, scale: 8 }),
  feeCurrency: text("fee_currency"),
  transactionId: text("transaction_id"),
  timestamp: bigint("timestamp", { mode: "number" }),
});

export type TradeItemSelect = typeof tradeItem.$inferSelect;
export const insertTradeItemSchema = createInsertSchema(tradeItem).omit({
  tradeId: true,
});
export type TradeItemInsert = z.infer<typeof insertTradeItemSchema>;
