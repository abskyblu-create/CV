import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import multer from "multer";
import "dotenv/config";
const { readJson, writeJson, ensureDirSync, pathExists } = fs;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = process.cwd();
console.log(`Root directory: ${ROOT_DIR}`);

const PORT = 3000;
const DATA_FILE = path.join(ROOT_DIR, "data", "portfolio.json");
console.log(`DATA_FILE path: ${DATA_FILE}`);
const UPLOADS_DIR = path.join(ROOT_DIR, "public", "uploads");

// Ensure directories exist
const DATA_DIR = path.join(ROOT_DIR, "data");
ensureDirSync(DATA_DIR);
ensureDirSync(UPLOADS_DIR);

console.log(`Data directory: ${DATA_DIR}`);
console.log(`Uploads directory: ${UPLOADS_DIR}`);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Multer configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
  const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
  });

  // API Routes
  app.get("/api/portfolio", async (req, res) => {
    console.log("GET /api/portfolio request received");
    try {
      if (!await pathExists(DATA_FILE)) {
        console.error(`Portfolio file not found at ${DATA_FILE}`);
        return res.status(404).json({ error: "Portfolio data file not found" });
      }
      const data = await readJson(DATA_FILE);
      console.log("Successfully read portfolio data");
      res.json(data);
    } catch (error) {
      console.error("Error reading portfolio data:", error);
      res.status(500).json({ error: "Failed to read portfolio data" });
    }
  });

  app.post("/api/portfolio", async (req, res) => {
    console.log("POST /api/portfolio request received");
    const { password, data } = req.body;
    // Simple password check - in a real app, use proper auth
    if (password !== (process.env.ADMIN_PASSWORD || "admin123")) {
      console.warn("Unauthorized portfolio update attempt");
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      await writeJson(DATA_FILE, data, { spaces: 2 });
      console.log("Successfully updated portfolio data");
      res.json({ message: "Portfolio updated successfully" });
    } catch (error) {
      console.error("Error updating portfolio data:", error);
      res.status(500).json({ error: "Failed to update portfolio data" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { password } = req.body;
    if (password === (process.env.ADMIN_PASSWORD || "admin123")) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: "Invalid password" });
    }
  });

  app.post("/api/upload", upload.single("image"), (req, res) => {
    console.log("POST /api/upload request received");
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    console.log(`File uploaded: ${imageUrl}`);
    res.json({ imageUrl });
  });

  // 404 for API routes to prevent falling through to Vite/SPA fallback
  app.all("/api/*", (req, res) => {
    console.warn(`404 for API route: ${req.method} ${req.url}`);
    res.status(404).json({ error: "API route not found" });
  });

  // Serve static files from public/uploads
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built files
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
