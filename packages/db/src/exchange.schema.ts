import { boolean, integer, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { WithModificationDates } from "./util/with-modifitaction-dates";
import { usersTable } from "./user.schema";
import { exchanges } from "@repo/exchange-info";

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
