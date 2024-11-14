import { z } from "zod";
import { exchanges, exchangeConfigs } from "@repo/exchange-info";

export const addUserExchangeSchema = z
  .object({
    exchangeId: z.enum(exchanges),
    nickname: z.string().min(1).max(32),
    apiKey: z.string().optional(),
    secret: z.string().optional(),
    uid: z.string().optional(),
    password: z.string().optional(),
    selfEncrypted: z.boolean().optional(),
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
