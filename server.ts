import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON and form data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API router - Proxy quote submissions to http://stadochtradgard.se/dashboard/submit_quote.php
  app.post("/api/submit-lead", async (req, res) => {
    try {
      const userAgent = req.headers["user-agent"] || "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      const body = req.body || {};

      const sqmNum = typeof body.square_meter === "number"
        ? body.square_meter
        : (parseInt(body.square_meter || body.squareMeter) || 0);

      let priceNum = 0;
      if (typeof body.suggested_price === "number") {
        priceNum = body.suggested_price;
      } else if (typeof body.suggestedPrice === "number") {
        priceNum = body.suggestedPrice;
      } else {
        const parsed = parseInt(String(body.suggested_price || body.suggestedPrice || "").replace(/[^0-9]/g, ""));
        priceNum = isNaN(parsed) ? 0 : parsed;
      }

      const submitPayload = {
        name: body.name || "",
        phone: body.phone || "",
        email: body.email || "",
        square_meter: sqmNum,
        city: body.city || "",
        address: body.address || body.city || "",
        move_date: body.move_date || body.cleaning_date || body.cleaningDate || "",
        message: body.message || "",
        suggested_price: priceNum,
        gclid: body.gclid || "",
        fbclid: body.fbclid || ""
      };

      console.log("Submitting quote payload to http://stadochtradgard.se/dashboard/submit_quote.php:", submitPayload);

      const params = new URLSearchParams();
      Object.entries(submitPayload).forEach(([key, val]) => {
        params.append(key, String(val ?? ""));
      });

      const response = await fetch("http://stadochtradgard.se/dashboard/submit_quote.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": userAgent,
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7"
        },
        body: params.toString()
      });

      const responseText = await response.text();
      console.log("CRM submit_quote response status:", response.status, responseText);

      let parsedData = null;
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        // text response
      }

      res.json({
        success: response.ok || response.status === 200,
        status: response.status,
        data: parsedData,
        textExcerpt: responseText.substring(0, 300)
      });
    } catch (e: any) {
      console.error("Error proxying submit_quote to PHP server:", e);
      res.json({ success: false, error: e.message });
    }
  });

  // API router - Proxy updates to http://stadochtradgard.se/dashboard/update_data.php
  app.post("/api/update-lead", async (req, res) => {
    try {
      const userAgent = req.headers["user-agent"] || "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      const body = req.body || {};

      console.log("Updating lead data via http://stadochtradgard.se/dashboard/update_data.php:", body);

      const params = new URLSearchParams();
      Object.entries(body).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          params.append(key, String(val));
        }
      });

      const response = await fetch("http://stadochtradgard.se/dashboard/update_data.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": userAgent,
          "Accept": "*/*",
          "Accept-Language": "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7"
        },
        body: params.toString()
      });

      const responseText = await response.text();
      console.log("CRM update_data response status:", response.status, responseText);

      let parsedData = null;
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        // text response
      }

      res.json({
        success: response.ok || response.status === 200,
        status: response.status,
        data: parsedData,
        textExcerpt: responseText.substring(0, 300)
      });
    } catch (e: any) {
      console.error("Error proxying update_data to PHP server:", e);
      res.json({ success: false, error: e.message });
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
