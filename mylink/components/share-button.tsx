"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLibrary } from "@/components/library-provider";

export function ShareButton() {
  const { notify } = useLibrary();
  const [fallbackUrl, setFallbackUrl] = useState("");
  async function copy() {
    const url = new URL("/", window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      notify("페이지 주소를 복사했어요.");
    } catch {
      setFallbackUrl(url);
    }
  }
  return <>
    <Button variant="ghost" className="share-button" onClick={copy}><Copy size={13} />페이지 주소 복사</Button>
    <Dialog open={Boolean(fallbackUrl)} onOpenChange={open => { if (!open) setFallbackUrl(""); }}>
      <DialogContent className="app-dialog">
        <DialogHeader><DialogTitle>페이지 주소 공유</DialogTitle><DialogDescription>자동 복사가 허용되지 않았어요. 아래 주소를 선택해서 직접 복사해 주세요.</DialogDescription></DialogHeader>
        <div className="form-field"><Label htmlFor="share-url">공개 페이지 주소</Label><Input id="share-url" value={fallbackUrl} readOnly onFocus={event => event.currentTarget.select()} /></div>
      </DialogContent>
    </Dialog>
  </>;
}
