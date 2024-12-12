import { boolean, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { WithModificationDates } from "./util/with-modifitaction-dates";
import { relations } from "drizzle-orm";
import { userExchangeConnectionsTable } from "./exchange.schema";

export const usersTable = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: text("email").default("").notNull(),
  username: varchar("username", { length: 255 }).unique(),
  onBoardingComplete: boolean("onboarding_complete").notNull().default(false),
  ...WithModificationDates,
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  exchangeConnections: many(userExchangeConnectionsTable),
}));

export type UserEntitySelect = typeof usersTable.$inferSelect;
export type UserEntityInsert = typeof usersTable.$inferInsert;
