const ALLOWED_ORIGIN = "https://startupintelligence.github.io";
const OWNER_EMAIL = "startupintelligence1@gmail.com";

function headers(origin) {
  return {
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
}
function reply(body, status, origin) {
  return new Response(JSON.stringify(body), { status, headers: headers(origin) });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      if (origin !== ALLOWED_ORIGIN) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: {
        ...headers(origin), "Access-Control-Max-Age": "86400"
      }});
    }
    if (origin !== ALLOWED_ORIGIN) return reply({ ok: false, error: "Origin not allowed." }, 403, origin);
    if (new URL(request.url).pathname !== "/admin-login-alert") return reply({ ok: false, error: "Not found." }, 404, origin);
    if (request.method !== "POST") return reply({ ok: false, error: "Method not allowed." }, 405, origin);
    if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
      return reply({ ok: false, error: "JSON required." }, 415, origin);
    }

    // IP is used only for rate limiting; it is not included in the email.
    const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
    if (!env.ADMIN_ALERT_LIMITER) return reply({ ok: false, error: "Rate limiting is not configured." }, 503, origin);
    const rate = await env.ADMIN_ALERT_LIMITER.limit({ key: clientIp });
    if (!rate.success) return reply({ ok: false, error: "Please try again later." }, 429, origin);

    let body;
    try { body = await request.json(); }
    catch { return reply({ ok: false, error: "Invalid JSON." }, 400, origin); }
    if (body?.event !== "admin_login_page_opened") {
      return reply({ ok: false, error: "Unsupported event." }, 400, origin);
    }
    if (!env.RESEND_API_KEY || !env.ALERT_FROM) {
      return reply({ ok: false, error: "Email service is not configured." }, 503, origin);
    }

    const timestamp = new Date().toISOString();
    const country = request.cf?.country || "Unknown";
    const userAgent = (request.headers.get("User-Agent") || "Unknown").slice(0, 300);
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.ALERT_FROM,
        to: [OWNER_EMAIL],
        subject: "Startup Intelligence: Admin login page opened",
        text: [
          "An event was recorded on the Startup Intelligence administrator login page.",
          "",
          "Event: Admin login page opened (not a verified login attempt)",
          `Time (UTC): ${timestamp}`,
          `Country/region estimate: ${country}`,
          `Browser user agent: ${userAgent}`,
          "",
          "This notification does not mean authentication succeeded.",
          "Admin access must require verified authentication and server-side authorization."
        ].join("\n")
      })
    });
    if (!sent.ok) return reply({ ok: false, error: "Email delivery failed." }, 502, origin);
    return reply({ ok: true }, 200, origin);
  }
};
