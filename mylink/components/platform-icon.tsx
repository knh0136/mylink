import { Camera, CodeXml, Globe, NotebookPen, Play } from "lucide-react";
import { linkHost } from "@/lib/model";

export function PlatformIcon({ url }: { url: string }) {
  const host = linkHost(url);
  const platform = host === 'instagram.com' ? 'instagram'
    : host === 'github.com' ? 'github'
    : host === 'blog.naver.com' ? 'blog'
    : 'other';
  const Icon = platform === 'instagram' ? Camera : platform === 'github' ? CodeXml : platform === 'blog' ? NotebookPen : host === 'youtube.com' || host === 'youtu.be' ? Play : Globe;
  return <span className={`platform-icon ${platform}`} aria-hidden="true"><Icon size={21} strokeWidth={1.65} /></span>;
}
