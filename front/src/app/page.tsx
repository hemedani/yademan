"use client";

import { useEffect } from "react";

export default function RootPage() {
  useEffect(() => {
    // Redirect to Persian locale if middleware isn't working
    if (window.location.pathname === "/") {
      window.location.href = "/fa";
    }
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Debug Page</h1>
      <p>If you see this page, the middleware is not redirecting properly.</p>
      <p>You should be automatically redirected to /fa</p>
      <div style={{ marginTop: "20px" }}>
        <p>Manual navigation:</p>
        <ul>
          <li>
            <a href="/fa">Go to Persian (fa)</a>
          </li>
          <li>
            <a href="/en">Go to English (en)</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
