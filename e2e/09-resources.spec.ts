import { test, expect } from "@playwright/test";

test.describe("资料库 /resources", () => {
  test("资料库首页 200 + 展示 20 篇文章", async ({ page }) => {
    const res = await page.goto("/resources");
    expect(res?.status()).toBe(200);

    // Hero 区
    await expect(page.locator(".resources-title")).toBeVisible();

    // 20 张资料卡片（ARTICLES.length）
    const cards = page.locator(".resource-card");
    await expect(cards).toHaveCount(20);
  });

  test("6 个分类 chip 全部显示", async ({ page }) => {
    await page.goto("/resources");
    const chips = page.locator(".resources-toc-chip");
    await expect(chips).toHaveCount(6);
    await expect(chips.first()).toBeVisible();
  });

  test("点击第一张卡片可进入详情页", async ({ page }) => {
    await page.goto("/resources");
    const firstLink = page
      .locator(".resource-card .resource-card-title a")
      .first();
    const href = await firstLink.getAttribute("href");
    expect(href).toMatch(/^\/resources\/[a-z0-9-]+$/);
    await firstLink.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator(".resource-detail-title")).toBeVisible();
    await expect(page.locator(".resource-detail-prose")).toBeVisible();
  });

  test("详情页含「返回资料库」链接与「参考文献」区", async ({ page }) => {
    await page.goto("/resources/big-five-academic-gold-standard");
    await expect(page.locator(".resource-detail-back")).toBeVisible();
    await expect(page.locator(".resource-detail-title")).toContainText(
      "大五人格",
    );
    await expect(page.locator(".resource-detail-refs")).toBeVisible();
    // CTA 跳测评
    const cta = page.locator(".resource-detail-cta a.btn-primary");
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", /#quiz/);
  });

  test("不存在的 slug 返回 404", async ({ page }) => {
    const res = await page.goto("/resources/this-slug-does-not-exist-xyz");
    expect(res?.status()).toBe(404);
  });
});
