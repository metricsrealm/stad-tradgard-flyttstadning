import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON and form data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API router - Proxy submissions to Städ & Trädgårdsservice AB database to avoid CORS issues
  app.post("/api/submit-lead", async (req, res) => {
    try {
      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
      const userAgent = req.headers["user-agent"] || "";

      // Gather form fields + UTM tags + technical fields
      const payload = {
        ...req.body,
        user_agent: req.body.user_agent || userAgent,
        user_ip: req.body.user_ip || clientIp,
      };

      console.log("Submitting lead proxy data:", payload);

      // Serialize as standard application/x-www-form-urlencoded for the PHP backend
      const params = new URLSearchParams();
      Object.entries(payload).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          params.append(key, String(val));
        }
      });

      // Send post request
      const response = await fetch("https://stadochtradgard.se/calculator_submit.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": userAgent
        },
        body: params,
      });

      const responseText = await response.text();
      console.log("CRM server response:", response.status, responseText.substring(0, 300));

      // Always return success to client to let redirect flow run flawlessly
      res.json({ success: true, textExcerpt: responseText.substring(0, 200) });
    } catch (e: any) {
      console.error("CRM submission failure proxying to PHP server, bypassing to keep user experience:", e);
      res.json({ success: true, error: e.message });
    }
  });

  // Route Vite assets or production build
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
