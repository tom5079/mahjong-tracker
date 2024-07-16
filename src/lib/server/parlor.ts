import prisma from "./prisma"

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

export function listParlors() {
    return prisma.parlor.findMany()
}