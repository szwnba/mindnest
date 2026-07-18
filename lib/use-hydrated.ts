"use client";

import { useState, useSyncExternalStore } from "react";

// useSyncExternalStore 的三个稳定回调(SSR 时 getServerSnapshot 必须返回固定值)
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * 客户端 hydration 守卫。
 *
 * SSR 与客户端首次渲染返回 `false`,hydration 完成后返回 `true`。
 * 用于在读取 localStorage / sessionStorage 前判断是否已挂载,
 * 避免 hydration mismatch。
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

/**
 * 在客户端 hydration 完成后执行一次初始化(如从 sessionStorage 读取持久化状态)。
 *
 * 利用 React 19 render 阶段 setState 的能力,避免在 `useEffect` 中调用 setState
 * (符合 `react-hooks/set-state-in-effect` 规则)。`init` 仅在客户端执行一次。
 *
 * @param init 初始化函数,可在其中调用 setState
 * @returns hydrated 是否已完成 hydration
 */
export function useHydratedInit(init: () => void): boolean {
  const hydrated = useHydrated();
  const [applied, setApplied] = useState(false);

  if (hydrated && !applied) {
    setApplied(true);
    init();
  }

  return hydrated;
}
