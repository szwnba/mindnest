import { test, expect } from "@playwright/test";

test.describe("首页核心组件", () => {
  test("页面加载无控制台错误", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await expect(page).toHaveURL("/");
    // 等待页面完全加载
    await page.waitForLoadState("networkidle");
    expect(errors).toHaveLength(0);
  });

  test("Hero 区域正确显示标题和描述", async ({ page }) => {
    await page.goto("/");
    const heroTitle = page.locator(".hero-title");
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText("认识你自己");

    const heroDesc = page.locator(".hero-desc");
    await expect(heroDesc).toBeVisible();
    await expect(heroDesc).toContainText("荣格心理类型理论");
  });

  test("Hero CTA 按钮可点击并跳转", async ({ page }) => {
    await page.goto("/");
    const ctaBtn = page.locator(".hero-actions .btn-primary");
    await expect(ctaBtn).toBeVisible();
    await expect(ctaBtn).toContainText("开始免费测评");
    await ctaBtn.click();
    await expect(page).toHaveURL(/#quiz/);
  });

  test("TrustBar 显示 4 个特点", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".trust-item")).toHaveCount(4);
    await expect(page.locator(".trust-item").first()).toContainText("学术理论支撑");
  });

  test("Frameworks 区域显示 6 个方法卡片", async ({ page }) => {
    await page.goto("/");
    await page.locator("#frameworks").scrollIntoViewIfNeeded();
    await expect(page.locator(".method-card")).toHaveCount(6);
  });

  test("CTA Banner 在页脚上方显示", async ({ page }) => {
    await page.goto("/");
    const ctaBanner = page.locator(".cta-banner");
    await ctaBanner.scrollIntoViewIfNeeded();
    await expect(ctaBanner).toBeVisible();
  });

  test("Hero 视觉卡片正确渲染", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".hero-floating-card").first()).toBeVisible();
    await expect(page.locator(".hfc-type-code")).toContainText("INFP");
  });

  test("HowItWorks 显示 3 个步骤", async ({ page }) => {
    await page.goto("/");
    await page.locator("#how").scrollIntoViewIfNeeded();
    await expect(page.locator(".step-card")).toHaveCount(3);
  });

  test("Resources 区域显示资料卡片", async ({ page }) => {
    await page.goto("/");
    await page.locator("#resources").scrollIntoViewIfNeeded();
    await expect(page.locator(".resource-featured")).toBeVisible();
    await expect(page.locator(".resource-small-card").first()).toBeVisible();
  });
});
