import type { VercelRequest, VercelResponse } from "@vercel/node";
import { updateStatus } from "../../lib/turso";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: "Missing id or status" });
  }

  try {
    const rowsAffected = await updateStatus(Number(id), status);

    if (rowsAffected === 0) {
      return res.status(404).json({ error: "Quote not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("PATCH /api/quotes/[id]/status error:", error);
    return res.status(500).json({ error: String(error) });
  }
}
