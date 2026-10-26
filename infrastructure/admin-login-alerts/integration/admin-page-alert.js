/*
 * Add this script to login/admin/index.html before </body>.
 * This reports a page open, NOT a verified credential submission or login.
 */
(() => {
  const ALERT_ENDPOINT = "https://startup-intelligence-admin-alert.startupintelligence1.workers.dev/admin-login-alert";
  fetch(ALERT_ENDPOINT, {
    method: "POST",
    mode: "cors",
    credentials: "omit",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "admin_login_page_opened" }),
    keepalive: true
  }).catch(() => {});
})();