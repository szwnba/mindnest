import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: `🧬 我的人格档案 · ${SITE_NAME}`,
  description: `查看你在 ${SITE_NAME} 的完整测评历史和跨框架人格档案。`,
  alternates: {
    canonical: "/profile",
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
