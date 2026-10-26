/*
 * Add this script to login/admin/index.html before </body>.
 * Replace the placeholder with your deployed Worker endpoint.
 * This reports a page open, NOT a verified credential submission or login.
 */
(() => {
  const ALERT_ENDPOINT = "https://REPLACE-WITH-YOUR-WORKER.workers.dev/admin-login-alert";
  if (ALERT_ENDPOINT.includes("REPLACE-WITH-YOUR-WORKER")) return;
  fetch(ALERT_ENDPOINT, {
    method: "POST",
    mode: "cors",
    credentials: "omit",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "admin_login_page_opened" }),
    keepalive: true
  }).catch(() => {});
})();
