import { refreshToken } from "./discord";
import prisma from "./prisma";

export function registerUserToken({
    sessionId,
    accessToken,
    refreshToken,
    expiresAt
}: {
    sessionId: string
    accessToken: string
    refreshToken: string
    expiresAt: Date
}) {
    return prisma.userToken.upsert({
        where: { sessionId },
        update: {
            accessToken,
            refreshToken,
            expiresAt
        },
        create: {
            sessionId,
            accessToken,
            refreshToken,
            expiresAt
        }
    })
}

export async function removeUserToken(sessionId: string) {
    return prisma.userToken.delete({
        where: { sessionId }
    })
}

export async function getUserToken(sessionId: string) {
    const userToken = await prisma.userToken.findUnique({
        where: { sessionId }
    })

    if (!userToken) {
        throw new Error("No user token found")
    }

    const { expiresAt } = userToken

    if (expiresAt < new Date()) {
        throw new Error("User token expired")
    }

    if (expiresAt.getTime() + 3600 * 1000 < new Date().getTime()) {
        const newToken = await refreshToken(userToken.refreshToken)

        registerUserToken({ sessionId, ...newToken })

        return newToken.accessToken
    }

    return userToken.accessToken
}