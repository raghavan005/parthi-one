import type { VercelRequest, VercelResponse } from "@vercel/node";
import { updateRow } from "../../lib/neon";

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
    const rows = await updateRow("quotes", Number(id), { status });

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Quote not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("PATCH /api/quotes/[id]/status error:", error);
    return res.status(500).json({ error: String(error) });
  }
}
