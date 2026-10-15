export async function onRequestPost(context: any) {
  const { request } = context;

  try {
    // Clone request or read JSON
    const body = (await request.json()) as any;

    const clientIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      "";
    const userAgent = request.headers.get("user-agent") || "";

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

    // Build CRM payload
    const payload = {
      ...body,
      service_type: serviceType,
      form: body.form || "Flyttstädning",
      user_agent: body.user_agent || userAgent,
      user_ip: body.user_ip || clientIp,
    };

    // Proxy the request to the live submit_form endpoint
    const response = await fetch("https://stadochtradgard.se/dashboard/submit_form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": userAgent,
        "Accept": "application/json"
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    return new Response(
      JSON.stringify({
        success: true,
        textExcerpt: responseText.substring(0, 200),
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: true,
        error: err.message || "Unknown error",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
