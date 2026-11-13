import type { Metadata } from "next";
import "./globals.css";
import { getLocale } from "@/lib/i18n-server";
import Analytics from "@/app/components/analytics";

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
  },
  other: {
    "baidu-site-verification": "codeva-jzdYLodoNN",
  },
};

// 结构化数据：告诉搜索引擎「驳学者」这个名称对应 boxuezhe.cc
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "驳学者",
  alternateName: ["驳学者社区", "Boxuezhe"],
  url: "https://boxuezhe.cc",
  description: "每条新评论，只能反驳上一条。一个反驳接力社区。",
  inLanguage: "zh-CN",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale === "en" ? "en" : "zh-CN"}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
