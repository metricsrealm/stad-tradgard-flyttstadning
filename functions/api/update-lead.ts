export async function onRequestPost(context: any) {
  const { request } = context;

  try {
    const body = (await request.json()) as any;

    const clientIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      "";
    const userAgent = request.headers.get("user-agent") || "";

    const targetCustomerId = body.customer_id || body.id;
    const fullComment = body.comment || body.message || "";

    const updatePayload = {
      action: body.action || 4,
      customer_id: targetCustomerId,
      id: targetCustomerId,
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
      square_meter: body.square_meter || body.squareMeter || 70,
      city: body.city || "",
      comment: fullComment,
      message: fullComment,
      button_click: "yes",
      is_button_click: "yes",
      user_agent: body.user_agent || userAgent,
      user_ip: body.user_ip || clientIp,
      utm_source: body.utm_source || "",
      utm_medium: body.utm_medium || "",
      utm_campaign: body.utm_campaign || "",
      gclid: body.gclid || "",
      fbclid: body.fbclid || ""
    };

    // 1. Update via https://stadochtradgard.se/dashboard/update_data (JSON)
    const updateResponse = await fetch("https://stadochtradgard.se/dashboard/update_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": userAgent,
        "Accept": "application/json, text/plain, */*"
      },
      body: JSON.stringify(updatePayload),
    });

    const responseText = await updateResponse.text();
    let parsedData = null;
    try {
      parsedData = JSON.parse(responseText);
    } catch {}

    // 2. Also sync with submit_form
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
          comment: fullComment,
          message: fullComment
        })
      });
    } catch (e) {}

    return new Response(
      JSON.stringify({
        success: updateResponse.ok || updateResponse.status === 200,
        status: updateResponse.status,
        id: targetCustomerId,
        data: parsedData,
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
        success: false,
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
