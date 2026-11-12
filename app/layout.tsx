import type { Metadata } from "next";
import "./globals.css";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  metadataBase: new URL("https://boxuezhe.cc"),
  title: {
    default: "驳学者",
    template: "%s · 驳学者",
  },
  description: "每条新评论，只能反驳上一条。",
  applicationName: "驳学者",
  openGraph: {
    type: "website",
    siteName: "驳学者",
    title: "驳学者",
    description: "每条新评论，只能反驳上一条。",
    locale: "zh_CN",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "驳学者",
    description: "每条新评论，只能反驳上一条。",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "J-JgVn30OJRJ9f5HffFaGBZkrYYibQ-GGbSVgijFO3c",
    baidu: "codeva-jzdYLodoNN",
  },
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
