import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `分享结果 · ${SITE_NAME}`,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `分享结果 · ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/share`,
    siteName: SITE_NAME,
    type: "website",
    locale: "zh_CN",
  },
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/share",
  },
};

export default function ShareLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
