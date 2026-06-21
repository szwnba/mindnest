import { test, expect } from "@playwright/test";

test.describe("导航与链接", () => {
  test("导航菜单所有链接有效", async ({ page }) => {
    await page.goto("/");
    // 获取导航中所有 a 标签
    const navLinks = page.locator('a[href^="/#"]');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute("href");
      expect(href).not.toBeNull();
      expect(href).not.toBe("#");
    }
  });

  test("导航到理论基础锚点", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/#frameworks"]');
    await expect(page.locator("#frameworks")).toBeAttached();
  });

  test("导航到人格类型锚点", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/#types"]');
    await expect(page.locator("#types")).toBeAttached();
  });

  test("导航到测评锚点", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/#quiz"]');
    await expect(page.locator("#quiz")).toBeAttached();
  });

  test("导航到资料库锚点", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/#resources"]');
    await expect(page.locator("#resources")).toBeAttached();
  });

  test("导航到 FAQ 锚点", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/#faq"]');
    await expect(page.locator("#faq")).toBeAttached();
  });

  test("页脚所有链接有有效 href", async ({ page }) => {
    await page.goto("/");
    const footerLinks = page.locator(".footer a");
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const href = await footerLinks.nth(i).getAttribute("href");
      expect(href).not.toBeNull();
      // 页脚链接应该以 / 或 # 或 http 开头
      expect(href!.match(/^(\/|#|http)/)).not.toBeNull();
    }
  });

  test("页脚「关于心栖」链接可访问", async ({ page }) => {
    await page.goto("/");
    await page.locator(".footer").scrollIntoViewIfNeeded();
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL("/about");
  });

  test("页脚「隐私政策」链接可访问", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/privacy"]');
    await expect(page).toHaveURL("/privacy");
  });

  test("页脚「使用条款」链接可访问", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/terms"]');
    await expect(page).toHaveURL("/terms");
  });

  test("跳转到主内容 skip link 可用", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.locator(".skip-to-content");
    // Skip link is hidden until focused - use evaluate to trigger CSS :focus
    await skipLink.evaluate((el) => (el as HTMLElement).focus());
    await expect(skipLink).toBeVisible();
    await skipLink.click();
    // #main is a <main> element - after skip link click it should be in viewport
    await expect(page.locator("#main")).toBeAttached();
    await page.locator("#main").waitFor({ state: "visible", timeout: 5000 });
  });

  test("导航到 /types 页面显示类型总览", async ({ page }) => {
    await page.goto("/types");
    const cards = page.locator(".type-card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("导航到 /about 页面正常渲染", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("导航到 /contact 页面正常渲染", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("h1")).toBeVisible();
  });
});
