import { z } from 'zod';

export const checkUsernameSchema = z.object({
	username: z.string().min(3).max(50)
});
