import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@libsql/client";

function getClient() {
  const rawUrl = process.env.TURSO_DATABASE_URL!;
  const url = rawUrl.replace(/^libsql:\/\//, "https://");
  return createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN! });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  try {
    const client = getClient();
    const result = await client.execute({
      sql: "DELETE FROM quotes WHERE id = ?",
      args: [Number(id)],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Quote not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("DELETE /api/quotes/[id] error:", error);
    return res.status(500).json({ error: String(error) });
  }
}
