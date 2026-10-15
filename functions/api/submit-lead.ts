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

    // Build CRM payload
    const payload = {
      ...body,
      user_agent: body.user_agent || userAgent,
      user_ip: body.user_ip || clientIp,
    };

    // Serialize as standard application/x-www-form-urlencoded
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        params.append(key, String(val));
      }
    });

    // Proxy the request to the PHP backend
    const response = await fetch("https://stadochtradgard.se/calculator_submit.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": userAgent,
      },
      body: params,
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
