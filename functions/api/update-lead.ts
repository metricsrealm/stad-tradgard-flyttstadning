export async function onRequestPost(context: any) {
  const { request } = context;

  try {
    const body = (await request.json()) as any;

    const clientIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      "";
    
    const defaultBrowserUA =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
    const rawUa = request.headers.get("user-agent") || "";
    const userAgent = rawUa && !rawUa.toLowerCase().includes("curl") ? rawUa : defaultBrowserUA;

    const targetCustomerId = body.customer_id || body.id || body.lead_id;
    const fullComment = body.comment || body.message || "";

    const updatePayload = {
      action: Number(body.action) || 4,
      customer_id: Number(targetCustomerId) || targetCustomerId,
      id: Number(targetCustomerId) || targetCustomerId,
      lead_id: Number(targetCustomerId) || targetCustomerId,
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
      square_meter: typeof body.square_meter === "number" ? body.square_meter : (parseInt(body.square_meter || body.squareMeter) || 70),
      city: body.city || "",
      comment: fullComment,
      message: fullComment,
      button_click: "yes",
      is_button_click: "yes",
      service_type: body.service_type || "Flyttstädning",
      form: body.form || "Flyttstädning",
      user_agent: body.user_agent || userAgent,
      user_ip: body.user_ip || clientIp,
      utm_source: body.utm_source || "",
      utm_medium: body.utm_medium || "",
      utm_campaign: body.utm_campaign || "",
      gclid: body.gclid || "",
      fbclid: body.fbclid || ""
    };

    console.log(`[update-lead] Updating CRM lead ${targetCustomerId} with is_button_click=yes`);

    // 1. Primary update via https://stadochtradgard.se/dashboard/update_data (JSON)
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

    // 2. Also forward to submit_form with is_button_click: "yes" and form: "Flyttstädning"
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
    console.error("[update-lead] Error updating lead:", err);
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
