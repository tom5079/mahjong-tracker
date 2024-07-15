import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
    database: process.env.PGDB || "mj_tracker",
    user: process.env.PGUSER || "postgres",
    host: process.env.PGHOST || "localhost"
})

export function createClient() {
    return pool.connect()
}