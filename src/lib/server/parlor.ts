import prisma from "./prisma"
import { getUserById } from "./user"

export function registerParlor({
    name,
    location,
    owner,
    website,
    note
}: {
    name: string,
    location: string,
    owner: string,
    website?: string,
    note: string
}) {
    return prisma.parlor.create({
        data: {
            name,
            location,
            owner,
            website,
            note
        }
    })
}

export async function listParlors() {
    return await Promise.all((await prisma.parlor.findMany()).map(async (parlor) => {
        return {
            ...parlor,
            ownerInfo: await getUserById(parlor.owner)
        }
    }))
}

export async function getParlor(id: number) {
    const parlor = await prisma.parlor.findUnique({ where: { id } })

    if (!parlor) { return null }

    return {
        ...parlor,
        ownerInfo: await getUserById(parlor.owner)
    }
}