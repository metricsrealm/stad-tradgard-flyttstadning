import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON and form data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API router - Proxy submissions to https://stadochtradgard.se/dashboard/submit_form
  app.post("/api/submit-lead", async (req, res) => {
    try {
      const incomingUa = (req.headers["user-agent"] as string) || "";
      const userAgent = incomingUa && !incomingUa.toLowerCase().includes("curl")
        ? incomingUa
        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
      
      const rawIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
      const clientIp = rawIp.split(",")[0].trim();

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

      let moveDate = body.move_date || body.cleaning_date || body.cleaningDate || "";

      const clientUserAgent = body.user_agent || incomingUa || userAgent;
      const fullComment = body.comment || body.message || "";

      // Normalize service_type to one of: Fönsterputsning (or window_cleaning), Hemstäd, Flyttstädning, Företagskunder
      let serviceType = "Flyttstädning";
      const rawService = String(body.service_type || body.serviceType || "").toLowerCase();
      if (rawService.includes("fönster") || rawService.includes("fonster") || rawService.includes("window")) {
        serviceType = "Fönsterputsning";
      } else if (rawService.includes("hem") || rawService.includes("home")) {
        serviceType = "Hemstäd";
      } else if (rawService.includes("företag") || rawService.includes("foretag") || rawService.includes("kontor") || rawService.includes("business")) {
        serviceType = "Företagskunder";
      } else {
        serviceType = "Flyttstädning";
      }

      const targetId = body.id || body.customer_id;

      // Everything else is forwarded, including nested objects and arrays
      const submitPayload = {
        ...body,
        ...(targetId ? { id: targetId, customer_id: targetId } : {}),
        service_type: serviceType,
        form: body.form || "Flyttstädning",
        name: body.name || "",
        phone: body.phone || "",
        email: body.email || "",
        square_meter: sqmNum,
        city: body.city || "",
        address: body.address || body.city || "",
        move_date: moveDate,
        cleaning_date: moveDate,
        message: fullComment,
        comment: fullComment,
        suggested_price: priceNum,
        button_click: body.button_click || "no",
        is_button_click: body.is_button_click || body.button_click || "no",
        user_agent: clientUserAgent,
        user_ip: body.user_ip || clientIp,
        user_type: body.user_type || "Privatperson"
      };

      console.log("Submitting lead payload to https://stadochtradgard.se/dashboard/submit_form:", submitPayload);

      const response = await fetch("https://stadochtradgard.se/dashboard/submit_form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": userAgent,
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7"
        },
        body: JSON.stringify(submitPayload)
      });

      const responseText = await response.text();
      console.log("CRM submit_form response status:", response.status, responseText);

      let parsedData: any = null;
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        // text response
      }

      const leadId = parsedData?.id || parsedData?.customer_id || targetId || null;

      // If is_button_click is yes, also ensure update_data is notified
      if ((body.is_button_click === "yes" || body.button_click === "yes") && leadId) {
        try {
          await fetch("https://stadochtradgard.se/dashboard/update_data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "User-Agent": userAgent,
              "Accept": "application/json, text/plain, */*"
            },
            body: JSON.stringify({
              action: 4,
              customer_id: leadId,
              id: leadId,
              is_button_click: "yes",
              button_click: "yes",
              name: body.name || "",
              phone: body.phone || "",
              email: body.email || "",
              comment: fullComment,
              message: fullComment
            })
          });
          console.log(`Successfully updated is_button_click=yes on update_data for lead ${leadId}`);
        } catch (updateErr) {
          console.warn("Secondary update_data notification error:", updateErr);
        }
      }

      res.json({
        success: response.ok || response.status === 200 || parsedData?.result === "success",
        status: response.status,
        id: leadId,
        data: parsedData,
        textExcerpt: responseText.substring(0, 300)
      });
    } catch (e: any) {
      console.error("Error proxying to submit_form:", e);
      res.json({ success: false, error: e.message });
    }
  });

  // API router - Proxy updates to https://stadochtradgard.se/dashboard/update_data
  app.post("/api/update-lead", async (req, res) => {
    try {
      const incomingUa = (req.headers["user-agent"] as string) || "";
      const userAgent = incomingUa && !incomingUa.toLowerCase().includes("curl")
        ? incomingUa
        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

      const rawIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
      const clientIp = rawIp.split(",")[0].trim();

      const body = req.body || {};

      const clientUserAgent = body.user_agent || incomingUa || userAgent;
      const fullComment = body.comment || body.message || "";

      const sqmNum = typeof body.square_meter === "number"
        ? body.square_meter
        : (parseInt(body.square_meter || body.squareMeter) || 0);

      const targetCustomerId = body.customer_id || body.id;

      const updatePayload: Record<string, any> = {
        action: body.action || 4,
        customer_id: targetCustomerId,
        id: targetCustomerId,
        name: body.name || "",
        email: body.email || "",
        phone: body.phone || "",
        square_meter: sqmNum,
        city: body.city || "",
        comment: fullComment,
        message: fullComment,
        button_click: "yes",
        is_button_click: "yes",
        user_agent: clientUserAgent,
        user_ip: body.user_ip || clientIp,
        utm_source: body.utm_source || "",
        utm_medium: body.utm_medium || "",
        utm_campaign: body.utm_campaign || "",
        gclid: body.gclid || "",
        fbclid: body.fbclid || ""
      };

      console.log("Updating lead data via https://stadochtradgard.se/dashboard/update_data (JSON):", updatePayload);

      // 1. Primary update via JSON to https://stadochtradgard.se/dashboard/update_data
      const updateResponse = await fetch("https://stadochtradgard.se/dashboard/update_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": userAgent,
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7"
        },
        body: JSON.stringify(updatePayload)
      });

      const responseText = await updateResponse.text();
      console.log("CRM update_data response status:", updateResponse.status, responseText.substring(0, 100));

      let parsedData = null;
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        // text response
      }

      // 2. Also forward to submit_form with is_button_click: "yes" as requested by user
      try {
        await fetch("https://stadochtradgard.se/dashboard/submit_form", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": userAgent,
            "Accept": "application/json"
          },
          body: JSON.stringify({
            service_type: body.service_type || "Flyttstädning",
            form: body.form || "Flyttstädning",
            name: body.name || "",
            phone: body.phone || "",
            email: body.email || "",
            id: targetCustomerId,
            customer_id: targetCustomerId,
            button_click: "yes",
            is_button_click: "yes",
            square_meter: sqmNum,
            city: body.city || "",
            comment: fullComment,
            message: fullComment
          })
        });
        console.log("Synchronized is_button_click=yes with submit_form endpoint");
      } catch (submitErr) {
        console.warn("Could not sync with submit_form:", submitErr);
      }

      res.json({
        success: updateResponse.ok || updateResponse.status === 200,
        status: updateResponse.status,
        id: targetCustomerId,
        data: parsedData,
        textExcerpt: responseText.substring(0, 300)
      });
    } catch (e: any) {
      console.error("Error proxying update_data to CRM:", e);
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
