import { listParlors } from "$lib/server/parlor";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
    return {
        parlors: await listParlors()
    }
}) satisfies PageServerLoad;