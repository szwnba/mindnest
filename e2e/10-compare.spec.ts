import { test, expect } from "@playwright/test";

test.describe("CompareSection — 我们 vs 16Personalities", () => {
  test("首页 #compare 区域可见", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#compare");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    await expect(page.locator("#compare-title")).toContainText(
      "我们与 16Personalities 的不同"
    );
  });

  test("表格有 10 行对比数据（桌面端 viewport）", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    const rows = page.locator(".compare-table tbody tr");
    await expect(rows).toHaveCount(10);
    // 表头三列存在并具有 scope="col"
    const cols = page.locator(".compare-table thead th[scope='col']");
    await expect(cols).toHaveCount(3);
  });

  test("nav 含 #compare 链接", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    const navLink = page.locator("nav a[href='/#compare']").first();
    await expect(navLink).toBeVisible();
    await expect(navLink).toHaveText("对比");
  });

  test("/compare 独立页面返回 200 且渲染完整 10 项", async ({ page }) => {
    const resp = await page.goto("/compare");
    expect(resp?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText(
      "我们与 16Personalities 的不同"
    );
    const items = page.locator(".compare-page-item");
    await expect(items).toHaveCount(10);
    // 每一项都有一个 details 展开
    const details = page.locator(".compare-page-detail");
    await expect(details).toHaveCount(10);
  });

  test("移动端不出现横向滚动（卡片堆叠）", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const section = page.locator("#compare");
    await section.scrollIntoViewIfNeeded();
    // 移动端表格隐藏、卡片显示
    await expect(page.locator(".compare-table-wrap")).toBeHidden();
    const cards = page.locator(".compare-cards .compare-card");
    await expect(cards).toHaveCount(10);
    // body 不应横向溢出
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
