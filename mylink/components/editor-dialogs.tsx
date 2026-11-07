"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLibrary } from "@/components/library-provider";
import { normalizeUrl, type MyLink } from "@/lib/model";

type CommonProps = { onClose: () => void; returnFocus: () => void };

export function LinkEditor({ link, onClose, returnFocus }: CommonProps & { link: MyLink | null }) {
  const { saveLink } = useLibrary();
  const [title, setTitle] = useState(link?.title ?? "");
  const [url, setUrl] = useState(link?.url ?? "");
  const [errors, setErrors] = useState<{ title?: string; url?: string; save?: string }>({});
  const titleRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const id = useId();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!title.trim()) nextErrors.title = "제목을 입력해 주세요.";
    const normalized = normalizeUrl(url);
    if (!url.trim()) nextErrors.url = "주소를 입력해 주세요.";
    else if (!normalized) nextErrors.url = "올바른 웹 주소를 입력해 주세요. 예: https://github.com/knh0136";
    setErrors(nextErrors);
    if (nextErrors.title || nextErrors.url) {
      (nextErrors.title ? titleRef : urlRef).current?.focus();
      return;
    }
    if (saveLink({ title: title.trim(), url: normalized! }, link?.id)) onClose();
    else setErrors({ save: "저장하지 못했어요. 브라우저의 사이트 데이터 설정을 확인한 후 다시 시도해 주세요." });
  }

  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent className="app-dialog" onCloseAutoFocus={event => { event.preventDefault(); returnFocus(); }}>
      <DialogHeader><DialogTitle>{link ? "링크 수정" : "새 링크 추가"}</DialogTitle><DialogDescription>{link ? "제목이나 주소를 바꾸고 저장해 주세요." : "나를 소개할 또 하나의 연결을 추가해 보세요."}</DialogDescription></DialogHeader>
      <form onSubmit={submit} noValidate>
        <div className="form-field"><Label htmlFor={`${id}-title`}>링크 제목</Label><Input ref={titleRef} id={`${id}-title`} value={title} onChange={event => setTitle(event.target.value)} placeholder="예: 나의 블로그" maxLength={60} autoComplete="off" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? `${id}-title-error` : undefined} />{errors.title && <p id={`${id}-title-error`} className="field-error" role="alert">{errors.title}</p>}</div>
        <div className="form-field"><Label htmlFor={`${id}-url`}>링크 주소</Label><Input ref={urlRef} id={`${id}-url`} value={url} onChange={event => setUrl(event.target.value)} placeholder="https://example.com" maxLength={2048} inputMode="url" autoComplete="url" autoCapitalize="none" spellCheck={false} aria-invalid={Boolean(errors.url)} aria-describedby={errors.url ? `${id}-url-error` : `${id}-url-help`} />{errors.url ? <p id={`${id}-url-error`} className="field-error" role="alert">{errors.url}</p> : <p id={`${id}-url-help`} className="field-help">https://를 생략하면 자동으로 붙여 드려요.</p>}</div>
        {errors.save && <p className="field-error" role="alert">{errors.save}</p>}
        <div className="dialog-actions"><Button type="button" variant="outline" onClick={onClose}>취소</Button><Button type="submit">{link ? "저장하기" : "추가하기"}</Button></div>
      </form>
    </DialogContent>
  </Dialog>;
}

export function ProfileEditor({ onClose, returnFocus }: CommonProps) {
  const { library, saveProfile } = useLibrary();
  const [name, setName] = useState(library.profile.name);
  const [initials, setInitials] = useState(library.profile.initials);
  const [bio, setBio] = useState(library.profile.bio);
  const [error, setError] = useState("");
  const id = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const initialsRef = useRef<HTMLInputElement>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !initials.trim()) {
      setError("이름과 이니셜을 모두 입력해 주세요.");
      (!name.trim() ? nameRef : initialsRef).current?.focus();
      return;
    }
    if (saveProfile({ name: name.trim(), initials: initials.trim(), bio: bio.trim() })) onClose();
    else setError("저장하지 못했어요. 브라우저의 사이트 데이터 설정을 확인해 주세요.");
  }

  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent className="app-dialog" onCloseAutoFocus={event => { event.preventDefault(); returnFocus(); }}>
      <DialogHeader><DialogTitle>프로필 편집</DialogTitle><DialogDescription>이름과 소개로 나만의 페이지를 완성해 보세요.</DialogDescription></DialogHeader>
      <form onSubmit={submit} noValidate>
        <div className="form-field"><Label htmlFor={`${id}-name`}>표시 이름</Label><Input ref={nameRef} id={`${id}-name`} value={name} onChange={event => setName(event.target.value)} maxLength={40} autoComplete="name" aria-invalid={Boolean(error && !name.trim())} aria-describedby={error ? `${id}-error` : undefined} /></div>
        <div className="form-field"><Label htmlFor={`${id}-initials`}>프로필 이니셜</Label><Input ref={initialsRef} id={`${id}-initials`} value={initials} onChange={event => setInitials(event.target.value)} maxLength={5} autoComplete="off" aria-invalid={Boolean(error && !initials.trim())} aria-describedby={error ? `${id}-error` : undefined} /><p className="field-help">프로필 이미지에 표시할 글자를 5자 이내로 입력해 주세요.</p></div>
        <div className="form-field"><Label htmlFor={`${id}-bio`}>한 줄 소개</Label><Textarea id={`${id}-bio`} value={bio} onChange={event => setBio(event.target.value)} maxLength={160} /><p className="field-help">{bio.length} / 160</p></div>
        {error && <p id={`${id}-error`} className="field-error" role="alert">{error}</p>}
        <div className="dialog-actions"><Button type="button" variant="outline" onClick={onClose}>취소</Button><Button type="submit">저장하기</Button></div>
      </form>
    </DialogContent>
  </Dialog>;
}
