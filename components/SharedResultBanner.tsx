"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { getTypeByCode } from "@/lib/data/personality-types";
import { BIG_FIVE_DIMENSIONS, BIG_FIVE_ORDER } from "@/lib/data/big-five-dimensions";
import { HEXACO_DIMENSIONS, HEXACO_ORDER } from "@/lib/data/hexaco-questions";
import { decodeBFI10FromUrl } from "@/lib/bfi10-scoring";
import { decodeHexacoFromUrl } from "@/lib/hexaco-scoring";

/**
 * 当 URL 含 `?result=mbti:INTJ` 或 `?result=bfi10:O72-C58-E33-A65-N42` 时，
 * 在 hero 上方显示「你的朋友的结果」banner。
 */
export default function SharedResultBanner() {
  const t = useTranslations("sharedResultBanner");
  const locale = useLocale();
  const params = useSearchParams();
  const [dismissed, setDismissed] = useState(false);

  // 不在 SSR 阶段渲染，避免 hydration 不一致
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  if (!mounted) return null;

  const raw = params.get("result");
  if (!raw || dismissed) return null;

  const [kind, payload] = raw.split(":");
  if (!kind || !payload) return null;

  if (kind === "mbti") {
    const code = payload.toUpperCase();
    const type = getTypeByCode(code);
    if (!type) return null;
    return (
      <div className="shared-result-banner" role="region" aria-label={t("ariaSharedResult")}>
        <div className="shared-result-banner-inner">
          <span className="shared-result-banner-icon" aria-hidden="true">{type.icon}</span>
          <div className="shared-result-banner-text">
            <strong>{t("mbtiText", { code: type.code, name: locale === "en" ? type.nameEn : type.nameZh })}</strong>
            <span>{type.shortDesc}</span>
          </div>
          <div className="shared-result-banner-actions">
            <Link href={`/types/${type.code}`} className="btn btn-primary btn-sm">
              {t("viewDetail")}
            </Link>
            <Link href="/#quiz" className="btn btn-ghost btn-sm">
              {t("retake")}
            </Link>
            <button
              type="button"
              className="shared-result-banner-close"
              aria-label={t("dismiss")}
              onClick={() => setDismissed(true)}
            >
              ×
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (kind === "bfi10") {
    const decoded = decodeBFI10FromUrl(payload);
    if (!decoded) return null;
    // 找到最高维度作为「主导」
    let topDim: "O" | "C" | "E" | "A" | "N" = BIG_FIVE_ORDER[0];
    let topVal = -1;
    for (const d of BIG_FIVE_ORDER) {
      if (decoded[d] > topVal) {
        topVal = decoded[d];
        topDim = d;
      }
    }
    const topMeta = BIG_FIVE_DIMENSIONS[topDim];
    return (
      <div className="shared-result-banner" role="region" aria-label={t("ariaBfi10Result")}>
        <div className="shared-result-banner-inner">
          <span className="shared-result-banner-icon" aria-hidden="true">{topMeta.icon}</span>
          <div className="shared-result-banner-text">
            <strong>{t("bfi10TopLabel")}</strong>
            <span>
              {t("bfi10TopDim", { name: locale === "en" ? topMeta.fullName : topMeta.name, value: topVal })}
              {" · "}
              {BIG_FIVE_ORDER.map((d) => `${d}${decoded[d]}`).join(" · ")}
            </span>
          </div>
          <div className="shared-result-banner-actions">
            <Link href="/#quiz-bfi10" className="btn btn-primary btn-sm">
              {t("retake")}
            </Link>
            <button
              type="button"
              className="shared-result-banner-close"
              aria-label={t("dismiss")}
              onClick={() => setDismissed(true)}
            >
              ×
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (kind === "hexaco") {
    const decoded = decodeHexacoFromUrl(payload);
    if (!decoded) return null;
    // 找到最高维度作为「主导」
    let topDim: "H" | "E" | "X" | "A" | "C" | "O" = HEXACO_ORDER[0];
    let topVal = -1;
    for (const d of HEXACO_ORDER) {
      if (decoded[d] > topVal) {
        topVal = decoded[d];
        topDim = d;
      }
    }
    const topMeta = HEXACO_DIMENSIONS[topDim];
    return (
      <div className="shared-result-banner" role="region" aria-label={t("ariaHexacoResult")}>
        <div className="shared-result-banner-inner">
          <span className="shared-result-banner-icon" aria-hidden="true">{topMeta.icon}</span>
          <div className="shared-result-banner-text">
            <strong>{t("hexacoTopLabel")}</strong>
            <span>
              {t("hexacoTopDim", { name: locale === "en" ? topMeta.fullName : topMeta.name, value: topVal })}
              {" · "}
              {HEXACO_ORDER.map((d) => `${d}${decoded[d]}`).join(" · ")}
            </span>
          </div>
          <div className="shared-result-banner-actions">
            <Link href="/hexaco" className="btn btn-primary btn-sm">
              {t("retake")}
            </Link>
            <button
              type="button"
              className="shared-result-banner-close"
              aria-label={t("dismiss")}
              onClick={() => setDismissed(true)}
            >
              ×
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
