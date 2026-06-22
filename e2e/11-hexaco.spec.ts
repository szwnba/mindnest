import { test, expect } from "@playwright/test";

test.describe("HEXACO 六大人格维度测试", () => {
  test("首页能点击进入 HEXACO", async ({ page }) => {
    await page.goto("/");
    const hexacoLink = page.locator('a[href="/hexaco"]');
    await expect(hexacoLink.first()).toBeVisible({ timeout: 10000 });
    await hexacoLink.first().click();
    await expect(page).toHaveURL(/\/hexaco/);
  });

  test("HEXACO 页面显示 intro 和开始按钮", async ({ page }) => {
    await page.goto("/hexaco");
    const startBtn = page.locator(".hexaco-intro .btn-primary");
    await expect(startBtn).toBeVisible({ timeout: 10000 });
    await expect(startBtn).toContainText("开始 HEXACO");
  });

  test("60 题流程完成并显示结果", async ({ page }) => {
    await page.goto("/hexaco");
    await page.locator(".hexaco-intro .btn-primary").click();

    // 每页 5 题，共 12 页
    for (let p = 0; p < 12; p++) {
      // 等待当前页的问题出现
      await page.waitForSelector(".hexaco-question-text", { timeout: 10000 });

      // 回答当前页的 5 个问题（每题选第三个选项：中立）
      const buttons = page.locator(".hexaco-likert-btn");
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        await buttons.nth(i).click();
        await page.waitForTimeout(50);
      }

      // 如果不是最后一页，等待页面切换
      if (p < 11) {
        await page.waitForTimeout(300);
      }
    }

    // 结果页应该出现
    await page.waitForSelector(".quiz-result", { timeout: 15000 });
    const resultName = page.locator(".quiz-result-name");
    await expect(resultName).toContainText("六维度分布");
  });

  test("结果页显示 6 个维度", async ({ page }) => {
    await page.goto("/hexaco");
    await page.locator(".hexaco-intro .btn-primary").click();

    // 快速回答所有题
    for (let p = 0; p < 12; p++) {
      const buttons = page.locator(".hexaco-likert-btn");
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        await buttons.nth(i).click();
        await page.waitForTimeout(50);
      }
      if (p < 11) await page.waitForTimeout(300);
    }

    await page.waitForSelector(".dim-bars", { timeout: 15000 });
    const bars = page.locator(".dim-bar");
    await expect(bars).toHaveCount(6);
  });

  test("雷达图渲染", async ({ page }) => {
    await page.goto("/hexaco");
    await page.locator(".hexaco-intro .btn-primary").click();

    for (let p = 0; p < 12; p++) {
      const buttons = page.locator(".hexaco-likert-btn");
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        await buttons.nth(i).click();
        await page.waitForTimeout(50);
      }
      if (p < 11) await page.waitForTimeout(300);
    }

    await page.waitForSelector(".radar-chart-wrapper svg", { timeout: 15000 });
    const svg = page.locator(".radar-chart-wrapper svg");
    await expect(svg).toBeVisible();
  });

  test("分享链接可复制", async ({ page }) => {
    await page.goto("/hexaco");
    await page.locator(".hexaco-intro .btn-primary").click();

    for (let p = 0; p < 12; p++) {
      const buttons = page.locator(".hexaco-likert-btn");
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        await buttons.nth(i).click();
        await page.waitForTimeout(50);
      }
      if (p < 11) await page.waitForTimeout(300);
    }

    await page.waitForSelector(".quiz-result-actions", { timeout: 15000 });
    const copyBtn = page.locator("button", { hasText: "复制结果链接" });
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();

    // 等待复制状态切换
    await page.waitForTimeout(400);
    const copiedBtn = page.locator("button", { hasText: "链接已复制" });
    await expect(copiedBtn).toBeVisible();
  });

  test("测评过程无控制台错误", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/hexaco");
    await page.locator(".hexaco-intro .btn-primary").click();

    // 回答前 2 页
    for (let p = 0; p < 2; p++) {
      const buttons = page.locator(".hexaco-likert-btn");
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        await buttons.nth(i).click();
        await page.waitForTimeout(50);
      }
      if (p < 1) await page.waitForTimeout(300);
    }

    expect(errors).toHaveLength(0);
  });
});
