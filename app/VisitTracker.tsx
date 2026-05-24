"use client";

import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    const path = `${window.location.pathname}${window.location.search}`;

    fetch("/api/metrics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        referrer: document.referrer || null,
      }),
      keepalive: true,
    }).catch(() => {
      // Analytics should never interrupt the visitor experience.
    });
  }, []);

  return null;
}
