import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = {
  title: "使用条款 · Terms",
  description: "心栖 MindNest 使用条款。当前页面正在建设中，敬请期待。",
};

export default function TermsPage() {
  return (
    <StubPage
      eyebrow="条款"
      title="使用条款 · Terms"
      body="完整的使用条款正在建设中。心栖测评仅作自我探索参考，不构成临床心理诊断。"
    />
  );
}
