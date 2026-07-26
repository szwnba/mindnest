import { test, expect } from "@playwright/test";

/**
 * E2E coverage for routes that previously had no dedicated tests.
 * Covers: /about, /enneagram, /privacy, /terms, /profile, /share
 */

test.describe("关于 /about", () => {
  test("页面加载 200 + 显示核心内容", async ({ page }) => {
    const res = await page.goto("/about");
    expect(res?.status()).toBe(200);

    // h1 标题
    await expect(page.locator("h1")).toContainText("关于");

    // 关键章节存在
    await expect(page.getByText("我们的理念")).toBeVisible();
    await expect(page.getByText("权威框架")).toBeVisible();
    await expect(page.getByText("隐私优先")).toBeVisible();
    await expect(page.getByText("开源透明")).toBeVisible();
  });
});

test.describe("九型人格 /enneagram", () => {
  test("页面加载 200 + 显示 Quiz 介绍页", async ({ page }) => {
    const res = await page.goto("/enneagram");
    expect(res?.status()).toBe(200);

    // Quiz 引入区存在 (标题 + tagline)
    await expect(page.getByText("九型人格测试")).toBeVisible();
    await expect(
      page.getByText(/核心动机、恐惧与欲望/),
    ).toBeVisible();
  });
});

test.describe("隐私政策 /privacy", () => {
  test("页面加载 200 + 显示核心内容", async ({ page }) => {
    const res = await page.goto("/privacy");
    expect(res?.status()).toBe(200);

    await expect(page.locator("h1")).toContainText("隐私政策");
    await expect(page.getByText(/数据只属于你/)).toBeVisible();
    await expect(page.getByText(/浏览器本地/)).toBeVisible();
  });
});

test.describe("使用条款 /terms", () => {
  test("页面加载 200 + 显示核心内容", async ({ page }) => {
    const res = await page.goto("/terms");
    expect(res?.status()).toBe(200);

    await expect(page.locator("h1")).toContainText("使用条款");
    await expect(page.getByText(/本网站即表示/)).toBeVisible();
  });
});

test.describe("人格档案 /profile", () => {
  test("页面加载 200 + 空状态提示", async ({ page }) => {
    const res = await page.goto("/profile");
    expect(res?.status()).toBe(200);

    // 无历史记录时显示空状态
    await expect(
      page.getByText(/完成一项测试后|开始第一项测评/),
    ).toBeVisible();
  });
});

test.describe("分享结果 /share", () => {
  test("带参数加载 200 + 显示分享卡片", async ({ page }) => {
    const res = await page.goto("/share?type=mbti&code=INTJ");
    expect(res?.status()).toBe(200);

    // 显示类型代码
    await expect(page.locator("h1")).toContainText("INTJ");
    // 有分享按钮
    await expect(page.getByText(/分享到 X/)).toBeVisible();
    // 有返回/再测链接
    await expect(page.getByText(/我也测一下/)).toBeVisible();
  });

  test("缺省参数时渲染占位符", async ({ page }) => {
    const res = await page.goto("/share");
    expect(res?.status()).toBe(200);
    // code 为空时显示 "—"
    await expect(page.locator("h1")).toContainText("—");
  });
});
