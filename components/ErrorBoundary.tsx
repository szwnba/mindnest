"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
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
      return (
        this.props.fallback || (
          <main
            id="main"
            className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center"
          >
            <h1 className="text-2xl font-display font-bold mb-4">
              出错了
            </h1>
            <p className="text-[var(--color-muted)] max-w-md">
              页面加载时遇到了问题。请刷新页面或返回首页。
            </p>
            <a
              className="mt-6 inline-flex h-10 items-center rounded-full bg-[var(--color-accent)] px-5 font-medium text-white hover:opacity-90 transition"
              href="/"
            >
              返回首页
            </a>
          </main>
        )
      );
    }

    return this.props.children;
  }
}
