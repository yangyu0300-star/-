import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "反驳接力社区",
  description: "每条新评论，只能反驳上一条。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
