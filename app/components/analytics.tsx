"use client";

import Script from "next/script";

export default function Analytics() {
  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id="YOUR_UMAMI_UUID"
      strategy="afterInteractive"
    />
  );
}
