"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { defaultLibrary } from "@/data/defaults";
import type { Library, MyLink, Profile } from "@/lib/model";
import { libraryRepository, STORAGE_KEY } from "@/lib/repository";

type LibraryContextValue = {
  library: Library;
  ready: boolean;
  storageIssue: string;
  saveProfile: (profile: Profile) => boolean;
  saveLink: (link: Omit<MyLink, "id">, id?: string) => boolean;
  deleteLink: (id: string) => boolean;
  notify: (message: string) => void;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [library, setLibrary] = useState<Library>(defaultLibrary);
  const [ready, setReady] = useState(false);
  const [storageIssue, setStorageIssue] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    function load() {
      try {
        setLibrary(libraryRepository.load() ?? defaultLibrary);
        setStorageIssue("");
      } catch {
        setStorageIssue("저장된 내용을 불러올 수 없어 기본 프로필을 표시합니다. 브라우저의 저장 공간 설정을 확인해 주세요.");
      }
    }
    load();
    setReady(true);
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY || event.key === null) load();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const commit = useCallback((next: Library, message: string) => {
    if (!ready) return false;
    try {
      libraryRepository.save(next);
      setLibrary(next);
      setStorageIssue("");
      setNotice(message);
      return true;
    } catch {
      setStorageIssue("변경 내용을 저장하지 못했습니다. 브라우저 저장 공간과 사이트 데이터 허용 설정을 확인한 뒤 다시 시도해 주세요.");
      return false;
    }
  }, [ready]);

  function saveProfile(profile: Profile) {
    return commit({ ...library, profile }, "프로필을 저장했어요.");
  }

  function saveLink(input: Omit<MyLink, "id">, id?: string) {
    if (id && !library.links.some(link => link.id === id)) {
      setStorageIssue("다른 탭에서 이 링크가 삭제되었습니다. 목록을 확인하고 다시 추가해 주세요.");
      return false;
    }
    if (!id && library.links.length >= 100) {
      setStorageIssue("링크는 최대 100개까지 저장할 수 있습니다.");
      return false;
    }
    const links = id
      ? library.links.map(link => link.id === id ? { ...link, ...input } : link)
      : [...library.links, { id: crypto.randomUUID(), ...input }];
    return commit({ ...library, links }, id ? "링크를 수정했어요." : "새 링크를 추가했어요.");
  }

  function deleteLink(id: string) {
    return commit({ ...library, links: library.links.filter(link => link.id !== id) }, "링크를 삭제했어요.");
  }

  return (
    <LibraryContext.Provider value={{ library, ready, storageIssue, saveProfile, saveLink, deleteLink, notify: setNotice }}>
      {children}
      <div aria-live="polite" aria-atomic="true">
        {notice && <div className="toast" role="status"><CheckCircle2 size={17} /><span>{notice}</span><button type="button" aria-label="알림 닫기" onClick={() => setNotice("")}><X size={14} /></button></div>}
      </div>
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) throw new Error("LibraryProvider is required");
  return context;
}
