import type { Metadata } from "next";
import ShareClient from "./ShareClient";

export const metadata: Metadata = {
  title: "分享结果 · MindNest",
  description: "分享你的 MindNest 人格测评结果给朋友。",
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
