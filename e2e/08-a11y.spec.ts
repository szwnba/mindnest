import { test, expect } from "@playwright/test";

test.describe("可访问性基础检查", () => {
  test("页面有正确的 lang 属性", async ({ page }) => {
    await page.goto("/");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("zh-CN");
  });

  test("页面有正确的 title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/心栖|MindNest/);
  });

  test("所有图片有 alt 属性", async ({ page }) => {
    await page.goto("/");
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).not.toBeNull();
    }
  });

 test("表单元素有 aria-label 或关联 label", async ({ page }) => {
   await page.goto("/");
   const inputs = page.locator("input, textarea, select");
   const count = await inputs.count();
   for (let i = 0; i < count; i++) {
     const input = inputs.nth(i);
     const ariaLabel = await input.getAttribute("aria-label");
     const id = await input.getAttribute("id");
     // 有 aria-label 或者有关联 label（通过 id）
     expect(ariaLabel || id).toBeTruthy();
   }
 });

  test("Tab 按钮有 role='tab' 和 aria-selected", async ({ page }) => {
    await page.goto("/");
    const tabs = page.locator(".types-tab");
    const count = await tabs.count();
    expect(count).toBeGreaterThan(0);

    // 检查 role
    const firstTabRole = await tabs.first().getAttribute("role");
    expect(firstTabRole).toBe("tab");

    // 检查 aria-selected
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "false");
  });

  test("导航有 aria-label", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    await expect(nav).toHaveAttribute("aria-label", "主导航");
  });

  test("页面有 main landmark", async ({ page }) => {
    await page.goto("/");
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("h1 标题存在且唯一", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toBeVisible();
  });

  test("section 区域有 aria-labelledby 或 aria-label", async ({ page }) => {
    await page.goto("/");
    const sections = page.locator("section");
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const section = sections.nth(i);
      const ariaLabelledby = await section.getAttribute("aria-labelledby");
      const ariaLabel = await section.getAttribute("aria-label");
      expect(ariaLabelledby || ariaLabel).toBeTruthy();
    }
  });

  test("skip-to-content 链接存在", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.locator(".skip-to-content");
    await expect(skipLink).toBeVisible();
    expect(await skipLink.getAttribute("href")).toBe("#main");
  });

  test("Hero 视觉卡片有 aria-label", async ({ page }) => {
    await page.goto("/");
    const heroVisual = page.locator(".hero-visual");
    const ariaLabel = await heroVisual.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();
  });

  test("type-card-link 有 aria-label", async ({ page }) => {
    await page.goto("/");
    const firstCardLink = page.locator(".type-card-link").first();
    const ariaLabel = await firstCardLink.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain("查看");
  });
});
