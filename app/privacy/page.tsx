import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = {
  title: "隐私政策 · Privacy",
  description: "心栖 MindNest 隐私政策。当前页面正在建设中，敬请期待。",
};

export default function PrivacyPage() {
  return (
    <StubPage
      eyebrow="隐私"
      title="隐私政策 · Privacy"
      body="完整的隐私政策正在建设中。当前测评结果仅保存在你本地浏览器的 sessionStorage 中，不会上传至服务器。"
    />
  );
}
