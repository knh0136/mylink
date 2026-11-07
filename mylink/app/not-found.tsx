import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><span className="eyebrow">404 · MYLINK</span><h1>길을 조금 벗어났네요.</h1><p>프로필 페이지에서 다시 시작해 보세요.</p><Link href="/" className="primary-link">프로필로 돌아가기 →</Link></main>;
}
