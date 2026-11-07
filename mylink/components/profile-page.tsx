"use client";

import { ArrowUpRight, Heart, Sparkles } from "lucide-react";
import { useLibrary } from "@/components/library-provider";
import { SiteShell } from "@/components/site-shell";
import { PlatformIcon } from "@/components/platform-icon";
import { ShareButton } from "@/components/share-button";
import { linkHost } from "@/lib/model";

export function ProfilePage() {
  const { library } = useLibrary();
  const { profile, links } = library;
  return (
    <SiteShell>
      <main id="main-content" className="profile-main">
        <div className="section-heading">MY LITTLE CORNER OF THE INTERNET</div>
        <div className="profile-grid">
          <section className="profile-intro" aria-labelledby="profile-name">
            <div className="avatar-wrap"><div className="avatar" aria-label={`${profile.initials} 이니셜`}>{profile.initials}</div><span className="avatar-dot" aria-hidden="true" /></div>
            <h1 id="profile-name" className="profile-name">{profile.name}</h1>
            <p className="profile-bio">{profile.bio}</p>
            <div className="profile-rule" />
            <p className="profile-caption"><Sparkles size={12} strokeWidth={1.6} />작은 링크로 이어지는 나의 이야기</p>
          </section>
          <section aria-labelledby="links-heading">
            <div className="links-topline"><h2 id="links-heading" className="links-label">나를 만나는 링크</h2><span className="links-count">{String(links.length).padStart(2, "0")} LINKS</span></div>
            {links.length > 0 ? <div className="public-links">{links.map(link => (
              <a key={link.id} className="link-card" href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`${link.title} (새 탭에서 열기)`}>
                <PlatformIcon url={link.url} />
                <span className="link-content"><span className="link-title">{link.title}</span><span className="link-domain">{linkHost(link.url)}</span></span>
                <ArrowUpRight className="link-arrow" size={18} strokeWidth={1.6} />
              </a>
            ))}</div> : <div className="empty-state"><Heart size={24} /><h2>새로운 연결을 기다리고 있어요.</h2><p>링크 관리에서 첫 링크를 추가해 보세요.</p></div>}
            <div className="share-row"><span className="share-caption">한곳에 모은, 나의 모든 연결.</span><ShareButton /></div>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}
