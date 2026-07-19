import { test, expect, type Page } from "@playwright/test";

test.describe.serial("HEXACO 六大人格维度测试", () => {
  async function clearHexacoStorage(page: Page) {
    await page.evaluate(() => {
      try {
        window.sessionStorage.removeItem("mindnest:hexaco-result-v1");
        window.sessionStorage.removeItem("mindnest:hexaco-answers-v1");
      } catch {
        // ignore
      }
    });
  }

  test("首页能点击进入 HEXACO", async ({ page }) => {
    await page.goto("/");
    // 确保没有残留的 HEXACO 答题状态
    await page.evaluate(() => {
      window.sessionStorage.removeItem("mindnest:hexaco-result-v1");
      window.sessionStorage.removeItem("mindnest:hexaco-answers-v1");
    });
    await page.locator("#quiz-hexaco").scrollIntoViewIfNeeded();
    await page.getByText("开始 HEXACO 测评").first().click();
    // 点击后应在首页内展开答题界面（出现第一题）
    await page.waitForSelector(".hexaco-question-block", { timeout: 10000 });
    const q1 = page.locator(".hexaco-question-text").first();
    await expect(q1).toBeVisible();
  });

  test("HEXACO 页面显示 intro 和开始按钮", async ({ page }) => {
    await page.goto("/hexaco");
    await clearHexacoStorage(page);
    const startBtn = page.locator(".hexaco-intro .btn-primary");
    await expect(startBtn).toBeVisible({ timeout: 10000 });
    await expect(startBtn).toContainText("开始 HEXACO");
  });

  test("60 题流程完成并显示结果", async ({ page }) => {
    test.setTimeout(120000);
    await page.goto("/hexaco");
    await clearHexacoStorage(page);
    await page.locator(".hexaco-intro .btn-primary").click();

    // 每页 5 题，共 12 页 — 快速点击不等待
    for (let p = 0; p < 12; p++) {
      const buttons = page.locator(".hexaco-likert-btn");
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        await buttons.nth(i).click();
      }
      const nextBtn = page.locator("button", { hasText: p === 11 ? "查看结果" : "下一页" });
      await nextBtn.click();
    }

    await page.waitForSelector(".quiz-result", { timeout: 30000 });
    const resultName = page.locator(".quiz-result-name");
    await expect(resultName).toContainText("六维度分布");
  });

  test("结果页显示 6 个维度", async ({ page }) => {
    test.setTimeout(120000);
    await page.goto("/hexaco");
    await clearHexacoStorage(page);
    await page.locator(".hexaco-intro .btn-primary").click();

    for (let p = 0; p < 12; p++) {
      const buttons = page.locator(".hexaco-likert-btn");
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        await buttons.nth(i).click();
      }
      const nextBtn = page.locator("button", { hasText: p === 11 ? "查看结果" : "下一页" });
      await nextBtn.click();
    }

    await page.waitForSelector(".dim-bars", { timeout: 30000 });
    const bars = page.locator(".dim-bar");
    await expect(bars).toHaveCount(6);
  });

  test("雷达图渲染", async ({ page }) => {
    test.setTimeout(120000);
    await page.goto("/hexaco");
    await clearHexacoStorage(page);
    await page.locator(".hexaco-intro .btn-primary").click();

    for (let p = 0; p < 12; p++) {
      const buttons = page.locator(".hexaco-likert-btn");
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        await buttons.nth(i).click();
      }
      const nextBtn = page.locator("button", { hasText: p === 11 ? "查看结果" : "下一页" });
      await nextBtn.click();
    }

    await page.waitForSelector(".radar-chart-wrapper svg", { timeout: 30000 });
    const svg = page.locator(".radar-chart-wrapper svg");
    await expect(svg).toBeVisible();
  });

  test("分享链接可复制", async ({ page }) => {
    // 直接预置结果到 sessionStorage，跳过 60 题循环
    await page.goto("/hexaco");
    await page.evaluate(() => {
      const mockResult = {
        H: 55, E: 42, X: 68, A: 73, C: 61, O: 58,
        profile: { H: "high", E: "medium", X: "high", A: "high", C: "high", O: "medium" },
        computedAt: Date.now(),
      };
      window.sessionStorage.setItem("mindnest:hexaco-result-v1", JSON.stringify(mockResult));
    });
    await page.reload();

    await page.waitForSelector(".quiz-result-actions", { timeout: 10000 });
    // Mock clipboard API 确保复制成功
    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: () => Promise.resolve() },
        writable: true,
        configurable: true,
      });
    });
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
    await clearHexacoStorage(page);
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
