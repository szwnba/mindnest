import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = {
  title: "联系我们 · Contact",
  description: "联系心栖 MindNest 团队。当前页面正在建设中，敬请期待。",
};

export default function ContactPage() {
  return (
    <StubPage
      eyebrow="联系"
      title="联系我们 · Contact"
      body="联系页面正在建设中。如需投稿或合作，请稍候并关注后续更新。"
    />
  );
}
