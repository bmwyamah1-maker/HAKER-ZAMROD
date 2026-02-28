import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = 3000;
const db = new Database("database.sqlite");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT
  );
  CREATE TABLE IF NOT EXISTS chat_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    user_id INTEGER,
    role TEXT,
    text TEXT,
    image TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(session_id) REFERENCES chat_sessions(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "haker-zamrod-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

// API Routes
app.get("/api/ping", (req, res) => res.json({ status: "online" }));

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  try {
    let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user) {
      const info = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)").run(email, password, email.split('@')[0]);
      user = { id: Number(info.lastInsertRowid), email, name: email.split('@')[0] };
    } else if (user.password !== password) {
      return res.status(401).json({ error: "كلمة المرور غير صحيحة" });
    }
    if (req.session) {
      (req.session as any).user = { id: Number(user.id), email: user.email, name: user.name };
    }
    res.json({ user: (req.session as any).user });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/auth/me", (req, res) => {
  if (req.session && (req.session as any).user) {
    res.json({ user: (req.session as any).user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

app.get("/api/chat/sessions", (req, res) => {
  const user = (req.session as any)?.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const sessions = db.prepare("SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY created_at DESC").all(user.id);
  res.json({ sessions });
});

app.post("/api/chat/sessions", (req, res) => {
  const user = (req.session as any)?.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  try {
    const { title } = req.body;
    const info = db.prepare("INSERT INTO chat_sessions (user_id, title) VALUES (?, ?)").run(user.id, title || "New Chat");
    res.json({ id: Number(info.lastInsertRowid), title: title || "New Chat" });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

app.delete("/api/chat/sessions/:id", (req, res) => {
  const user = (req.session as any)?.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  db.prepare("DELETE FROM messages WHERE session_id = ? AND user_id = ?").run(req.params.id, user.id);
  db.prepare("DELETE FROM chat_sessions WHERE id = ? AND user_id = ?").run(req.params.id, user.id);
  res.json({ success: true });
});

app.get("/api/chat/history/:sessionId", (req, res) => {
  const user = (req.session as any)?.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const history = db.prepare("SELECT role, text, image FROM messages WHERE session_id = ? AND user_id = ? ORDER BY timestamp ASC").all(req.params.sessionId, user.id);
  res.json({ history });
});

app.post("/api/chat/message", (req, res) => {
  const user = (req.session as any)?.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const { role, text, image, sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: "Session ID required" });
  db.prepare("INSERT INTO messages (session_id, user_id, role, text, image) VALUES (?, ?, ?, ?, ?)").run(sessionId, user.id, role, text, image || null);
  res.json({ success: true });
});

// Serve Static Files from dist
const distPath = path.join(process.cwd(), "dist");
if (fs.existsSync(distPath)) {
  console.log("[HAKER ZAMROD] Serving from dist folder");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  console.log("[HAKER ZAMROD] dist folder not found, serving fallback");
  app.get("*", (req, res) => {
    res.send("<h1>HAKER ZAMROD: SYSTEM BOOTING...</h1><p>Please refresh in 10 seconds.</p>");
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[HAKER ZAMROD] Server running on http://0.0.0.0:${PORT}`);
});
