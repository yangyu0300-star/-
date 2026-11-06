import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "驳学者",
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
