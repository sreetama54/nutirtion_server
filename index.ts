import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const app = express();

/* IMPORTANT for large JSON */
app.use(express.json({ limit: "20mb" }));

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "nutrition.json");

/* Ensure data folder exists */
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

/* =========================
   POST – Upload Nutrition
   ========================= */
app.post("/admin/nutrition", (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: "Empty payload" });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(201).json({ message: "Nutrition data saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save data" });
  }
});

/* =========================
   GET – Fetch Nutrition
   ========================= */
app.get("/api/nutrition", (_req: Request, res: Response) => {
 console.log()
  if (!fs.existsSync(DATA_FILE)) {
    return res.status(404).json({ error: "Nutrition data not found" });
  }

  res.setHeader("Content-Type", "application/json");
  res.sendFile(DATA_FILE);
});

/* =========================
   Health Check
   ========================= */
app.get("/", (_req: Request, res: Response) => {
  res.send("Nutrition API is running");
  //res.send()
});

/* =========================
   Start Server
   ========================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
