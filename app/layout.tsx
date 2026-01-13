import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ColorFit AI - 퍼스널 컬러 기반 스타일링",
  description: "퍼스널 컬러와 의상 정보를 입력하면 AI가 코디, 향, 액세서리를 추천해드립니다.",
  keywords: ["AI 코디 추천", "퍼스널 컬러", "스타일링", "패션 AI", "코디 추천", "향수 추천", "오늘의 코디"],
  authors: [{ name: "ColorFit AI" }],
  creator: "ColorFit AI",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "ColorFit AI",
    title: "ColorFit AI - 퍼스널 컬러 기반 스타일링",
    description: "퍼스널 컬러와 의상 정보를 입력하면 AI가 코디, 향, 액세서리를 추천해드립니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ColorFit AI - 퍼스널 컬러 기반 스타일링",
    description: "퍼스널 컬러와 의상 정보를 입력하면 AI가 코디, 향, 액세서리를 추천해드립니다.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
