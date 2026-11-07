"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Link2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLibrary } from "@/components/library-provider";

export function SiteShell({ children, managing = false }: { children: React.ReactNode; managing?: boolean }) {
  const { storageIssue } = useLibrary();
  return (
    <div className="site-shell">
      <a href="#main-content" className="skip-link">본문으로 바로가기</a>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="MyLink 프로필 홈"><span className="brand-mark"><Link2 size={19} strokeWidth={2.3} /></span>mylink<span style={{ color: "#aa91cc", marginLeft: -8 }}>.</span></Link>
        <nav className="header-actions" aria-label="주 메뉴">
          <span className="header-caption">A little more about me.</span>
          <Button asChild variant="outline" className="nav-button">
            <Link href={managing ? "/" : "/mypage/"}>{managing ? <ArrowLeft size={13} /> : <SlidersHorizontal size={13} />}{managing ? "프로필 보기" : "링크 관리"}</Link>
          </Button>
        </nav>
      </header>
      {storageIssue && <div className="storage-error" role="alert">{storageIssue}</div>}
      {children}
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} MyLink. Made to connect.</span>
        <span className="footer-credit">한양대학교 · 바이브코딩<span className="footer-separator">/</span><a href="https://github.com/knh0136/mylink" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={12} /></a></span>
      </footer>
    </div>
  );
}
