import type { Metadata } from "next";
import "./globals.css";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "驳学者",
  description: "每条新评论，只能反驳上一条。",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale === "en" ? "en" : "zh-CN"}>
      <body>{children}</body>
    </html>
  );
}
