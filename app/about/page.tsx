import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = {
  title: "关于心栖 · About",
  description:
    "关于心栖 MindNest——人格探索实验室。站点介绍页面正在建设中。",
};

export default function AboutPage() {
  return (
    <StubPage
      eyebrow="关于"
      title="关于心栖 · About"
      body="站点介绍页面正在建设中，稍后请反馈服务联系。我们在用科学且温和的方式，帮助每个人更好地理解自己。"
    />
  );
}
