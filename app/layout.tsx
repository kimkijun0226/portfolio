import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { AppToaster } from "@/components/ui/AppToaster";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-space-grotesk",
  display: "swap",
});

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
