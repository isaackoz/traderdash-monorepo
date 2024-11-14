import { boolean, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { WithModificationDates } from "./util/with-modifitaction-dates";

export const usersTable = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: text("email").default("").notNull(),
  username: varchar("username", { length: 255 }).unique(),
  onBoardingComplete: boolean("onboarding_complete").notNull().default(false),
  ...WithModificationDates,
});

export type UserEntitySelect = typeof usersTable.$inferSelect;
export type UserEntityInsert = typeof usersTable.$inferInsert;
