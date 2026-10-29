/**
 * Whether auth cookies may carry the `Secure` flag.
 *
 * `Secure` describes the **transport**, not the build mode. A production build
 * served over plain HTTP — an IP-only host with no TLS terminator in front — must
 * not set it: the browser silently drops the cookie, so login looks successful
 * and every subsequent request arrives anonymous.
 *
 * Defaults to the previous behaviour (`NODE_ENV === "production"`). Deployments
 * without TLS set `COOKIE_SECURE=false`; remove the override once the host is
 * behind HTTPS.
 */
export const secureCookie = (): boolean => {
  const override = process.env.COOKIE_SECURE;
  if (override !== undefined) {
    return override === "true" || override === "1";
  }
  return process.env.NODE_ENV === "production";
};
