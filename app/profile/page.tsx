import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `🧬 我的人格档案 · ${SITE_NAME}`,
  description: `查看你在 ${SITE_NAME} 的完整测评历史和跨框架人格档案。`,
  alternates: {
    canonical: "/profile",
  },
};

export default function ProfilePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            name: `我的人格档案 · ${SITE_NAME}`,
            description: "查看你的完整测评历史和跨框架人格档案。",
            isPartOf: {
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
            },
          }),
        }}
      />
      <ProfileClient />
    </>
  );
}
