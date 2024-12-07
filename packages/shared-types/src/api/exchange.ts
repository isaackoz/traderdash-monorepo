import type { ExchangeConnectionSelect } from "@repo/db";
export type TAPIUserExchangeGet = Omit<
  ExchangeConnectionSelect,
  "apiKeyHashed" | "secretHashed" | "uidHashed" | "passwordHashed"
> & {
  apiKey: string | null;
  secret: string | null;
  uid: string | null;
  password: string | null;
};
