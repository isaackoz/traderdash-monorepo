import { z } from "zod";
import { exchanges, exchangeConfigs } from "@repo/exchange-info";
import { insertTradeItemSchema, insertTradeSchema } from "@repo/db";
export const addUserExchangeSchema = z
  .object({
    exchangeId: z.enum(exchanges),
    nickname: z.string().min(1).max(32),
    apiKey: z.string().optional(),
    secret: z.string().optional(),
    uid: z.string().optional(),
    password: z.string().optional(),
    selfEncrypted: z.boolean().optional(),
    proxyUrl: z.union([z.literal(""), z.string().url()]).optional(),
    noProxy: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    // Verify that the exchange has the required auth values
    const exchInfo = exchangeConfigs[val.exchangeId];

    if (exchInfo.authentication.enabled) {
      // API Key
      if (exchInfo.authentication.requireApiKey) {
        if (!val.apiKey || val.apiKey.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "An API key is required for this exchange",
            path: ["apiKey"],
          });
        }
      }

      // Password
      if (exchInfo.authentication.requirePassword) {
        if (!val.password || val.password.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A password is required for this exchange",
            path: ["password"],
          });
        }
      }

      // Secret
      if (exchInfo.authentication.requireSecret) {
        if (!val.secret || val.secret.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A secret is required for this exchange",
            path: ["secret"],
          });
        }
      }

      // Uid
      if (exchInfo.authentication.requireUid) {
        if (!val.uid || val.uid.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A UID is required for this exchange",
            path: ["uid"],
          });
        }
      }
    }
  });

export type AddUserExchangeData = z.infer<typeof addUserExchangeSchema>;

// todo: move this to frontend only since we don't use this on the backend
export const addTradeSchema = z.object({
  exchangeConnectionId: z.coerce.number(),
  marketSymbol: z
    .string()
    .min(3)
    .regex(
      /^[^/]+\/[^/]+$/,
      "Invalid format. Must be QUOTE/PAIR, separated by a single /"
    ),
  side: z.enum(["buy", "sell"]),
  initialAmount: z.coerce.number(),
  entryPrice: z.number(),
  /**
   * Unix time in ms
   */
  fromTimestamp: z.coerce.number(),
  toTimestamp: z.coerce.number(),
  fromTradeId: z.string(),
});

export type AddTradeData = z.infer<typeof addTradeSchema>;

export const addTradeToDbSchema = z.object({
  tradeData: insertTradeSchema,
  tradeItems: z.array(insertTradeItemSchema),
});

export type AddTradeToDbData = z.infer<typeof addTradeToDbSchema>;
