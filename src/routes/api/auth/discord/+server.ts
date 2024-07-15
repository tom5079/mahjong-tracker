import type { RequestHandler } from "./$types";

export const GET: RequestHandler = ({ url, locals: { client }, cookies }) => {
    return new Response(url.searchParams.get("code") || "No code provided")
}