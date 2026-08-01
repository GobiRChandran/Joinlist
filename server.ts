import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.ts";
import { waitlist } from "./src/db/schema.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.post("/api/waitlist", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      await db.insert(waitlist).values({ email }).onConflictDoNothing();
      res.json({ success: true });
    } catch (error: any) {
      console.error("Waitlist error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/waitlist", async (req, res) => {
    try {
      const entries = await db.select().from(waitlist);
      res.json(entries);
    } catch (error: any) {
      console.error("Waitlist fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
