// See https://kit.svelte.dev/docs/types#app

import type { PoolClient } from "pg";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			client: PoolClient;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
