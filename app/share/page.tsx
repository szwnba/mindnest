import type { Metadata } from "next";
import ShareClient from "./ShareClient";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `分享结果 · ${SITE_NAME}`,
  description: `分享你的 ${SITE_NAME} 人格测评结果给朋友。`,
  alternates: {
    canonical: "/share",
  },
};

interface SharePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SharePage({ searchParams }: SharePageProps) {
  const params = await searchParams;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `分享结果 · ${SITE_NAME}`,
            description: `分享你的人格测评结果给朋友。`,
            isPartOf: {
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
            },
          }),
        }}
      />
      <ShareClient params={params} />
    </>
  );
}
