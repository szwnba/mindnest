import { test, expect } from "@playwright/test";

test.describe("人格探索 Tab 切换", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#types");
  });

  test("默认显示全部 16 种类型", async ({ page }) => {
    const cards = page.locator("#types .type-card");
    await expect(cards).toHaveCount(16);
  });

  test("点击「分析家」Tab 显示 4 个类型", async ({ page }) => {
    await page.click("text=分析家");
    await page.waitForTimeout(500);
    const cards = page.locator("#types .type-card");
    await expect(cards).toHaveCount(4);
    // 验证都是分析家类型
    const codes = await page.locator("#types .type-code").allTextContents();
    const analystCodes = ["INTJ", "INTP", "ENTJ", "ENTP"];
    for (const code of codes) {
      expect(analystCodes).toContain(code);
    }
  });

  test("点击「外交家」Tab 显示 4 个类型", async ({ page }) => {
    await page.click("text=外交家");
    await page.waitForTimeout(500);
    const cards = page.locator("#types .type-card");
    await expect(cards).toHaveCount(4);
    const codes = await page.locator("#types .type-code").allTextContents();
    const diplomatCodes = ["INFJ", "INFP", "ENFJ", "ENFP"];
    for (const code of codes) {
      expect(diplomatCodes).toContain(code);
    }
  });

  test("点击「守卫者」Tab 显示 4 个类型", async ({ page }) => {
    await page.click("text=守卫者");
    await page.waitForTimeout(500);
    const cards = page.locator("#types .type-card");
    await expect(cards).toHaveCount(4);
    const codes = await page.locator("#types .type-code").allTextContents();
    const sentinelCodes = ["ISTJ", "ISFJ", "ESTJ", "ESFJ"];
    for (const code of codes) {
      expect(sentinelCodes).toContain(code);
    }
  });

  test("点击「探险家」Tab 显示 4 个类型", async ({ page }) => {
    await page.click("text=探险家");
    await page.waitForTimeout(500);
    const cards = page.locator("#types .type-card");
    await expect(cards).toHaveCount(4);
    const codes = await page.locator("#types .type-code").allTextContents();
    const explorerCodes = ["ISTP", "ISFP", "ESTP", "ESFP"];
    for (const code of codes) {
      expect(explorerCodes).toContain(code);
    }
  });

  test("Tab 切换后卡片可见（无空白 bug）", async ({ page }) => {
    await page.click("text=探险家");
    await page.waitForTimeout(500);
    // 关键断言：卡片容器不应有 opacity:0 或 visibility:hidden
    const grid = page.locator("#types .types-grid");
    const opacity = await grid.evaluate(
      (el) => window.getComputedStyle(el).opacity
    );
    expect(Number(opacity)).toBeGreaterThan(0);
    // 卡片应可见
    const firstCard = page.locator("#types .type-card").first();
    await expect(firstCard).toBeVisible();
  });

  test("Tab 切换 aria-selected 状态正确", async ({ page }) => {
    const tabs = page.locator(".types-tab");
    // 默认第一个选中
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "false");
    // 点击第二个 tab
    await tabs.nth(1).click();
    await page.waitForTimeout(300);
    await expect(tabs.first()).toHaveAttribute("aria-selected", "false");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  });

  test("Tab 切换无控制台错误", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.click("text=分析家");
    await page.waitForTimeout(300);
    await page.click("text=外交家");
    await page.waitForTimeout(300);
    await page.click("text=守卫者");
    await page.waitForTimeout(300);
    await page.click("text=探险家");
    await page.waitForTimeout(300);
    await page.click("text=全部类型");
    await page.waitForTimeout(300);

    expect(errors).toHaveLength(0);
  });

  test("Tab active 类切换正确", async ({ page }) => {
    const tabs = page.locator(".types-tab");
    await expect(tabs.first()).toHaveClass(/active/);
    await tabs.nth(2).click();
    await page.waitForTimeout(300);
    await expect(tabs.nth(2)).toHaveClass(/active/);
    await expect(tabs.first()).not.toHaveClass(/active/);
  });
});
