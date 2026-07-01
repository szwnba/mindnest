"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  readUnifiedProfile,
  TEST_META,
  type UnifiedProfile,
} from "@/lib/unified-profile";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const [profile, setProfile] = useState<UnifiedProfile | null>(null);

  useEffect(() => {
    setProfile(readUnifiedProfile());
  }, []);

  if (!profile) {
    return (
      <main className="container narrow" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="profile-loading">{t("loading")}</div>
      </main>
    );
  }

  const isEmpty = profile.totalCompleted === 0;

  return (
    <main className="container narrow" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
      <header className="profile-header">
        <h1>{t("title")}</h1>
        <p className="profile-subtitle">
          {isEmpty
            ? t("emptySubtitle")
            : t("subtitle", { count: profile.totalCompleted })}
        </p>
      </header>

      {isEmpty ? (
        <div className="profile-empty">
          <div className="profile-empty-icon">🧩</div>
          <p>{t("emptyHint")}</p>
          <Link href="/hexaco" className="btn btn-primary">
            {t("startFirstTest")}
          </Link>
        </div>
      ) : (
        <div className="profile-grid">
          {/* HEXACO Card */}
          <ProfileCard
            framework="hexaco"
            completed={profile.hexaco.completed}
            inProgress={profile.hexaco.inProgress}
            dims={
              profile.hexaco.result
                ? Object.entries(profile.hexaco.result)
                    .filter(([k]) => k !== "profile" && k !== "computedAt")
                    .map(([k, v]) => ({
                      letter: k,
                      pct: v as number,
                      level: profile.hexaco.result!.profile[k as keyof typeof profile.hexaco.result.profile],
                    }))
                : null
            }
            code={null}
          />

          {/* BFI10 Card */}
          <ProfileCard
            framework="bfi10"
            completed={profile.bfi10.completed}
            inProgress={profile.bfi10.inProgress}
            dims={
              profile.bfi10.result
                ? Object.entries(profile.bfi10.result)
                    .filter(([k]) => k !== "profile" && k !== "computedAt")
                    .map(([k, v]) => ({
                      letter: k,
                      pct: v as number,
                      level: profile.bfi10.result!.profile[k as keyof typeof profile.bfi10.result.profile],
                    }))
                : null
            }
            code={null}
          />

          {/* MBTI Card */}
          <ProfileCard
            framework="mbti"
            completed={profile.mbti.completed}
            inProgress={profile.mbti.inProgress}
            dims={null}
            code={profile.mbti.result?.code ?? null}
          />
        </div>
      )}
    </main>
  );
}

function ProfileCard({
  framework,
  completed,
  inProgress,
  dims,
  code,
}: {
  framework: keyof typeof TEST_META;
  completed: boolean;
  inProgress: boolean;
  dims: { letter: string; pct: number; level: string }[] | null;
  code: string | null;
}) {
  const t = useTranslations("profile");
  const meta = TEST_META[framework];

  return (
    <div className={`profile-card profile-card--${framework} ${completed ? "is-completed" : inProgress ? "is-progress" : "is-pending"}`}>
      <div className="profile-card-head">
        <span className="profile-card-icon">{meta.icon}</span>
        <div>
          <div className="profile-card-name">{meta.name}</div>
          <div className="profile-card-dims">
            {t("dimCount", { count: meta.dimensions })}
          </div>
        </div>
      </div>

      {completed && dims && (
        <div className="profile-card-dims-bars">
          {dims.map((d) => (
            <div key={d.letter} className="profile-dim-row">
              <span className="profile-dim-letter">{d.letter}</span>
              <div className="profile-dim-bar">
                <div
                  className="profile-dim-fill"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
              <span className={`profile-dim-level profile-dim-level--${d.level}`}>
                {d.level}
              </span>
            </div>
          ))}
        </div>
      )}

      {completed && code && (
        <div className="profile-card-mbti-code">{code}</div>
      )}

      <div className="profile-card-action">
        {completed ? (
          <Link href={meta.route} className="btn btn-ghost btn-sm">
            {t("viewResult")}
          </Link>
        ) : inProgress ? (
          <>
            <span className="profile-inprogress-badge">{t("inProgress")}</span>
            <Link href={meta.route} className="btn btn-primary btn-sm">
              {t("continueTest")}
            </Link>
          </>
        ) : (
          <Link href={meta.route} className="btn btn-primary btn-sm">
            {t("startTest")}
          </Link>
        )}
      </div>
    </div>
  );
}
