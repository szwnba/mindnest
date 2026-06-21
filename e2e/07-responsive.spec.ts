import { test, expect } from "@playwright/test";

test.describe("移动端响应式 (375px)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test("移动端页面正常加载无横向滚动", async ({ page }) => {
    await page.goto("/");
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test("移动端 Hero 区域正常显示", async ({ page }) => {
    await page.goto("/");
    const heroTitle = page.locator(".hero-title");
    await expect(heroTitle).toBeVisible();
  });

  test("移动端导航汉堡菜单可见", async ({ page }) => {
    await page.goto("/");
    const mobileBtn = page.locator(".nav-mobile-btn");
    await expect(mobileBtn).toBeVisible();
  });

  test("移动端点击汉堡菜单展开导航", async ({ page }) => {
    await page.goto("/");
    await page.locator(".nav-mobile-btn").click();
    await page.waitForTimeout(500);
    // 导航链接应该可见
    const navLinks = page.locator("#primaryNav");
    await expect(navLinks).toBeVisible();
  });

  test("移动端 Tab 切换正常", async ({ page }) => {
    await page.goto("/");
    await page.locator("#types").scrollIntoViewIfNeeded();

    // 默认 16 个卡片
    await expect(page.locator("#types .type-card").first()).toBeVisible();

    // 点击分析家
    await page.click("text=分析家");
    await page.waitForTimeout(500);
    const cards = page.locator("#types .type-card");
    await expect(cards).toHaveCount(4);
  });

  test("移动端类型卡片可读（文字不被截断）", async ({ page }) => {
    await page.goto("/");
    await page.locator("#types").scrollIntoViewIfNeeded();
    const firstCard = page.locator("#types .type-card").first();
    await expect(firstCard).toBeVisible();

    // 检查卡片在 viewport 内
    const box = await firstCard.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(375);
  });

  test("移动端 FAQ 可点击展开", async ({ page }) => {
    await page.goto("/");
    await page.locator("#faq").scrollIntoViewIfNeeded();
    const firstFaq = page.locator(".faq-native").first();
    await firstFaq.click();
    await page.waitForTimeout(300);
    const isOpen = await firstFaq.evaluate(
      (el) => (el as HTMLDetailsElement).open
    );
    expect(isOpen).toBe(true);
  });

  test("移动端 CTA 按钮可见", async ({ page }) => {
    await page.goto("/");
    const ctaBtn = page.locator(".hero-actions .btn-primary");
    await expect(ctaBtn).toBeVisible();
    // 按钮不应溢出
    const box = await ctaBtn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(375);
  });

  test("移动端无控制台错误", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // 交互：点击 tab、展开 FAQ
    await page.locator("#types").scrollIntoViewIfNeeded();
    await page.click("text=探险家");
    await page.waitForTimeout(300);

    expect(errors).toHaveLength(0);
  });

  test("移动端页脚正常显示", async ({ page }) => {
    await page.goto("/");
    await page.locator(".footer").scrollIntoViewIfNeeded();
    await expect(page.locator(".footer")).toBeVisible();
    await expect(page.locator(".footer-brand-text")).toBeVisible();
  });
});
