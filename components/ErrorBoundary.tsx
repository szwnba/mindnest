"use client";

import { Component, ReactNode } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

function ErrorBoundaryFallback() {
  const t = useTranslations("errorBoundary");
  return (
    <main
      id="main"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center"
    >
      <h1 className="text-2xl font-display font-bold mb-4">{t("title")}</h1>
      <p className="text-[var(--color-muted)] max-w-md">{t("description")}</p>
      <Link
        className="mt-6 inline-flex h-10 items-center rounded-full bg-[var(--color-accent)] px-5 font-medium text-white hover:opacity-90 transition"
        href="/"
      >
        {t("homeLink")}
      </Link>
    </main>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorBoundaryFallback />;
    }
    return this.props.children;
  }
}
