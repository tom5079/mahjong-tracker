import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const parlors = [
    {
        name: 'Berkeley Mahjong Club',
        location: 'Berkeley, CA',
        owner: 'akadora3',
        moderators: ['tookoo', 'akadora3'],
        members: ['tookoo', 'akadora3', 'kaiiste'],
        note: 'university, open to public, beginner friendly'
    },
    {
        name: 'Pacific Mahjong League',
        location: 'Fremont, CA',
        owner: 'konata_akemi',
        moderators: ['konata_akemi', 'queenie710'],
        members: ['konata_akemi', 'queenie710', 'akadora3'],
        note: 'in-person, open to public, beginner friendly, competitive'
    },
    {
        name: 'LAPOM',
        location: 'Gardena, CA',
        owner: 'omasakun.',
        moderators: ['omasakun.'],
        members: ['omasakun.', 'akadora3', 'konata_akemi'],
        note: 'in-person, open to public, beginner friendly, competitive'
    }
]

async function main() {

}

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect();
    process.exit(1);
})