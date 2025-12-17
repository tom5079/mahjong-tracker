import type { Nominal } from './nominal'

export type UserId = Nominal<string, 'UserId'>

export type User = {
    id: UserId
    username: string
    avatar: string | null
}
