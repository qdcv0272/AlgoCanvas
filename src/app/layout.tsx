import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlgoCanvas",
  description: "알고리즘 시각화 학습",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
