import type { Metadata } from "next";
import { LibraryProvider } from "@/components/library-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kim Nam Ho · MyLink",
  description: "한양대학교 컴퓨터소프트웨어학부 김남호의 프로필과 링크 모음입니다.",
  openGraph: {
    title: "Kim Nam Ho · MyLink",
    description: "한양대학교 컴퓨터소프트웨어학부 김남호의 링크를 한곳에서 만나보세요.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body><LibraryProvider>{children}</LibraryProvider></body>
    </html>
  );
}
