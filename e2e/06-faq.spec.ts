import { test, expect } from "@playwright/test";

test.describe("FAQ 展开收起", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#faq").scrollIntoViewIfNeeded();
  });

  test("FAQ 列表显示 5 个问题", async ({ page }) => {
    const faqItems = page.locator(".faq-native");
    await expect(faqItems).toHaveCount(5);
  });

  test("点击第一个 FAQ 展开内容", async ({ page }) => {
    const firstFaq = page.locator(".faq-native").first();
    await firstFaq.click();
    // details 元素 open 属性应该为 true
    const isOpen = await firstFaq.evaluate(
      (el) => (el as HTMLDetailsElement).open
    );
    expect(isOpen).toBe(true);
  });

  test("再次点击第一个 FAQ 收起内容", async ({ page }) => {
    const firstFaq = page.locator(".faq-native").first();
    const summary = firstFaq.locator(".faq-native-summary");
    // 先展开
    await summary.click();
    await page.waitForTimeout(300);
    let isOpen = await firstFaq.evaluate(
      (el) => (el as HTMLDetailsElement).open
    );
    expect(isOpen).toBe(true);
    // 再收起
    await summary.click();
    await page.waitForTimeout(300);
    isOpen = await firstFaq.evaluate(
      (el) => (el as HTMLDetailsElement).open
    );
    expect(isOpen).toBe(false);
  });

  test("点击多个 FAQ 都能正常展开", async ({ page }) => {
    const faqItems = page.locator(".faq-native");
    const count = await faqItems.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      await faqItems.nth(i).click();
      await page.waitForTimeout(300);
      const isOpen = await faqItems.nth(i).evaluate(
        (el) => (el as HTMLDetailsElement).open
      );
      expect(isOpen).toBe(true);
    }
  });

  test("FAQ 无控制台错误", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    const firstFaq = page.locator(".faq-native").first();
    await firstFaq.click();
    await page.waitForTimeout(300);
    await firstFaq.click();
    await page.waitForTimeout(300);

    expect(errors).toHaveLength(0);
  });

  test("FAQ 区域标题可见", async ({ page }) => {
    const faqTitle = page.locator("#faq .section-title");
    await expect(faqTitle).toBeVisible();
    await expect(faqTitle).toContainText("关于人格测评");
  });
});
