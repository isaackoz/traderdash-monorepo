import { z } from 'zod';

export const checkUsernameSchema = z.string().min(3).max(50);

export type CheckUsernameSchema = z.infer<typeof checkUsernameSchema>;
