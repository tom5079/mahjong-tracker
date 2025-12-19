import * as z from 'zod'

export const UserId = z.string().brand<'UserId'>()
export type UserId = z.infer<typeof UserId>

export const User = z.object({
    id: UserId,
    username: z.string().min(2).max(100),
    avatar: z.url().nullable(),
})
export type User = z.infer<typeof User>
