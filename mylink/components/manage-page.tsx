"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, CircleUserRound, FolderHeart, HardDrive, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLibrary } from "@/components/library-provider";
import { SiteShell } from "@/components/site-shell";
import { PlatformIcon } from "@/components/platform-icon";
import { LinkEditor, ProfileEditor } from "@/components/editor-dialogs";
import { linkHost, type MyLink } from "@/lib/model";

export function ManagePage() {
  const { library, ready, deleteLink } = useLibrary();
  const [editing, setEditing] = useState<{ link: MyLink | null } | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [deleting, setDeleting] = useState<MyLink | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const openerRef = useRef<HTMLElement | null>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const { profile, links } = library;

  function rememberOpener(event: React.MouseEvent<HTMLButtonElement>) { openerRef.current = event.currentTarget; }
  function returnFocus() {
    requestAnimationFrame(() => {
      const target = openerRef.current;
      if (target?.isConnected) target.focus();
      else addButtonRef.current?.focus();
    });
  }

  return <SiteShell managing>
    <main id="main-content" className="manage-main">
      <div className="manage-heading"><div><span className="eyebrow">YOUR SPACE, YOUR LINKS</span><h1>나의 링크, 내 방식대로.</h1><p>프로필을 다듬고, 좋아하는 연결을 모아 보세요.</p></div></div>
      <div className="local-note"><HardDrive size={16} /><p><strong>이 브라우저에만 저장돼요.</strong><br />편집한 내용은 새로고침 후에도 유지되지만, 다른 기기나 공유받은 방문자에게는 반영되지 않습니다.</p></div>
      <div className="manage-grid">
        <section className="panel" aria-labelledby="manage-profile-heading"><h2 className="panel-title" id="manage-profile-heading"><CircleUserRound size={15} />내 프로필</h2><div className="mini-profile"><div className="avatar" aria-label={`${profile.initials} 이니셜`}>{profile.initials}</div><h2>{profile.name}</h2><p>{profile.bio}</p></div><Button variant="outline" className="profile-edit-button" disabled={!ready} onClick={event => { rememberOpener(event); setEditingProfile(true); }}><Pencil size={13} />프로필 편집</Button></section>
        <section className="panel" aria-labelledby="manage-links-heading">
          <div className="panel-header"><h2 className="panel-title" id="manage-links-heading">내 링크<span className="count-pill">{links.length}</span></h2><Button ref={addButtonRef} className="add-button" disabled={!ready || links.length >= 100} onClick={event => { rememberOpener(event); setEditing({ link: null }); }}><Plus size={14} />링크 추가</Button></div>
          {links.length ? <div className="managed-list">{links.map(link => <div key={link.id} className="managed-item">
            <PlatformIcon url={link.url} />
            <a className="link-content" href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`${link.title} (새 탭에서 열기)`}><span className="link-title">{link.title}</span><span className="link-domain">{linkHost(link.url)} <ArrowUpRight size={9} style={{ display: "inline" }} /></span></a>
            <div className="row-actions"><Button variant="ghost" size="icon" className="icon-action" disabled={!ready} aria-label={`${link.title} 수정`} onClick={event => { rememberOpener(event); setEditing({ link }); }}><Pencil size={14} /></Button><Button variant="ghost" size="icon" className="icon-action delete" disabled={!ready} aria-label={`${link.title} 삭제`} onClick={event => { rememberOpener(event); setDeleteError(""); setDeleting(link); }}><Trash2 size={14} /></Button></div>
          </div>)}</div> : <div className="empty-state"><FolderHeart size={25} /><h2>아직 모아 둔 링크가 없어요.</h2><p>링크 추가 버튼으로 첫 링크를 만들어 보세요.</p></div>}
          <p className="management-hint">제목과 웹 주소만 있으면 충분해요. 최대 100개의 링크를 모을 수 있습니다.</p>
        </section>
      </div>
    </main>
    {editing && <LinkEditor key={editing.link?.id ?? "new"} link={editing.link} onClose={() => setEditing(null)} returnFocus={returnFocus} />}
    {editingProfile && <ProfileEditor onClose={() => setEditingProfile(false)} returnFocus={returnFocus} />}
    <AlertDialog open={Boolean(deleting)} onOpenChange={open => { if (!open) setDeleting(null); }}>
      <AlertDialogContent className="app-dialog" onCloseAutoFocus={event => { event.preventDefault(); returnFocus(); }}>
        <AlertDialogHeader><AlertDialogTitle>링크를 삭제할까요?</AlertDialogTitle><AlertDialogDescription>‘{deleting?.title}’ 링크가 목록에서 삭제됩니다.<br />이 작업은 되돌릴 수 없습니다.</AlertDialogDescription></AlertDialogHeader>
        {deleteError && <p className="field-error" role="alert">{deleteError}</p>}
        <AlertDialogFooter><AlertDialogCancel>취소</AlertDialogCancel><AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={event => { event.preventDefault(); if (deleting && deleteLink(deleting.id)) setDeleting(null); else setDeleteError("삭제 내용을 저장하지 못했어요. 잠시 후 다시 시도해 주세요."); }}>삭제하기</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </SiteShell>;
}
