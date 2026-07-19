import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `我的测评档案 · ${SITE_NAME}`,
  description: `查看你在 ${SITE_NAME} 的完整测评历史和人格档案。`,
  robots: { index: true, follow: true },
};

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
