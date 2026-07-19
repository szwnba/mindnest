import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="container narrow" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "4rem", fontWeight: 700, lineHeight: 1, marginBottom: "1rem" }}>
          404
        </h1>
        <p style={{ fontSize: "1.25rem", color: "var(--text-muted)", marginBottom: "2rem" }}>
          你访问的页面不存在或已被移除
        </p>
        <Link href="/" className="btn btn-primary btn-lg">
          返回首页
        </Link>
      </div>
    </main>
  );
}
