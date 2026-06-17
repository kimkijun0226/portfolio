import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { AppToaster } from "@/components/ui/AppToaster";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-space-grotesk",
  // [성능] display: swap — 웹폰트 로드 전에도 시스템 폰트로 텍스트를 먼저 표시
  display: "swap",
});

// [성능] Supabase API 도메인 preconnect — Projects 데이터 fetch 시 TLS 핸드셰이크를 앞당김
const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
  : null;

export const metadata: Metadata = {
  title: "김기준 · 프론트엔드 개발자",
  description:
    "컴포넌트 설계와 성능 최적화로 UX와 DX 모두를 개선하는 프론트엔드 개발자 김기준입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      data-theme="dark"
      className={`h-full ${spaceGrotesk.variable}`}
    >
      <head>
        {supabaseOrigin ? (
          <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
        ) : null}
      </head>
      <body className="h-full overflow-hidden overscroll-none bg-bg font-sans text-fg antialiased">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
