import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";
import ShareClient from "./ShareClient";

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
  return <ShareClient params={params} />;
}
