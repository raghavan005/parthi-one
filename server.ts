import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import fs from "fs";

// Initialize SQLite database
const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, "database.sqlite");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

// Setup schema
db.exec(`
  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    email TEXT NOT NULL,
    material TEXT NOT NULL,
    specs_width TEXT NOT NULL,
    specs_height TEXT NOT NULL,
    handle_type TEXT NOT NULL,
    quantity TEXT NOT NULL,
    printed_logo TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Submit a new quote request
  app.post("/api/quotes", (req, res) => {
    try {
      const {
        client_name,
        business_name,
        mobile_number,
        email,
        material,
        specs_width,
        specs_height,
        handle_type,
        quantity,
        printed_logo
      } = req.body;

      const stmt = db.prepare(`
        INSERT INTO quotes (
          client_name, business_name, mobile_number, email, 
          material, specs_width, specs_height, handle_type, quantity, printed_logo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const info = stmt.run(
        client_name, business_name, mobile_number, email,
        material, specs_width, specs_height, handle_type, quantity, printed_logo
      );

      res.status(201).json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      console.error("Error creating quote:", error);
      res.status(500).json({ error: "Failed to create quote" });
    }
  });

  // Get all quotes (for admin)
  app.get("/api/quotes", (req, res) => {
    try {
      const stmt = db.prepare("SELECT * FROM quotes ORDER BY created_at DESC");
      const quotes = stmt.all();
      res.json(quotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ error: "Failed to fetch quotes" });
    }
  });

  // Update quote status
  app.patch("/api/quotes/:id/status", (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const stmt = db.prepare("UPDATE quotes SET status = ? WHERE id = ?");
      const info = stmt.run(status, id);
      
      if (info.changes > 0) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Quote not found" });
      }
    } catch (error) {
      console.error("Error updating quote status:", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Note: dist contains index.html, not server output unless that is modified by the script
    // The build script puts server in dist/server.cjs and static in dist/
    // actually, vite build puts client files in dist/ directly.
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA Fallback for express v4
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
