"use client";

import Script from "next/script";

export default function Analytics() {
  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id="c8887050-a211-4646-92b1-3c26fee25781"
      strategy="afterInteractive"
    />
  );
}
