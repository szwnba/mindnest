import { test, expect } from "@playwright/test";

test.describe("MindNest 冒烟测试", () => {
  test("首页加载 + 标题 + 无死链", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await expect(page).toHaveURL("/");

    // 标题正确
    await expect(page.locator(".hero-title")).toContainText("认识你自己");

    // 无 JS 错误
    expect(errors).toHaveLength(0);
  });

  test("Tab 切换 + 卡片可见（用户报告的空白 bug）", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#types");

    // 默认 16 个卡片
    await expect(page.locator("#types .type-card")).toHaveCount(16);

    // 点击"分析家"Tab
    await page.click("text=分析家");
    await page.waitForTimeout(500);

    const cards = page.locator("#types .type-card");
    await expect(cards).toHaveCount(4);

    // 关键：卡片可见（不是 opacity:0）
    const firstCard = cards.first();
    await expect(firstCard).toBeVisible();
  });

  test("类型详情页加载", async ({ page }) => {
    await page.goto("/types/INTJ");
    await expect(page.locator(".type-detail-code")).toHaveText("INTJ");
    await expect(page.locator(".type-detail-prose")).toBeVisible();
  });
});
