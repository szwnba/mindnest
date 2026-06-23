import { test, expect } from "@playwright/test";

test.describe("新功能 smoke：BFI-10 + history + 分享 banner", () => {
  test("首页正常加载（含 BFI-10 与 banner suspense）", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    const resp = await page.goto("/");
    expect(resp?.status()).toBeLessThan(400);
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });

  test("BFI-10 section 存在且 intro 显示开始按钮", async ({ page }) => {
    await page.goto("/");
    await page.locator("#quiz-bfi10").scrollIntoViewIfNeeded();
    await expect(page.locator("#quiz-bfi10")).toBeVisible();
    const startBtn = page.locator("#quiz-bfi10 .btn-primary").first();
    await expect(startBtn).toBeVisible();
    await expect(startBtn).toContainText("开始大五测评");
  });

  test("BFI-10 答题：选择第 1 题后进入第 2 题", async ({ page }) => {
    await page.goto("/");
    await page.locator("#quiz-bfi10").scrollIntoViewIfNeeded();
    await page.locator("#quiz-bfi10 .btn-primary").first().click();
    await page.waitForTimeout(400);
    const question = page.locator("#quiz-bfi10 .bfi10-question-text").first();
    await expect(question).toBeVisible();
    const firstText = await question.textContent();
    // 在 BFI-10 section 内点 likert 选项（选中立 = 第 3 个）
    await page.locator("#quiz-bfi10 .likert-btn").nth(2).click();
    await page.waitForTimeout(400);
    const newText = await page.locator("#quiz-bfi10 .bfi10-question-text").first().textContent();
    expect(newText).not.toBe(firstText);
  });

  test("BFI-10 全测完写入 localStorage 历史，并出结果页", async ({ page }) => {
    await page.goto("/");
    await page.locator("#quiz-bfi10").scrollIntoViewIfNeeded();
    await page.locator("#quiz-bfi10 .btn-primary").first().click();
    await page.waitForTimeout(300);
    // 10 题，每题选中立（第 3 个 likert）
    for (let i = 0; i < 10; i++) {
      await page.locator("#quiz-bfi10 .likert-btn").nth(2).click();
      await page.waitForTimeout(300);
    }
    // 结果出来后应有「复制结果链接」按钮
    const copyBtn = page.locator("#quiz-bfi10 button:has-text(\"复制结果链接\")");
    await expect(copyBtn).toBeVisible({ timeout: 5000 });

    // localStorage 应该有 bfi10 历史
    const raw = await page.evaluate(() => window.localStorage.getItem("mindnest_quiz_history"));
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBeGreaterThanOrEqual(1);
    expect(parsed[0].type).toBe("bfi10");
    expect(parsed[0].result).toHaveProperty("O");
    expect(parsed[0].result).toHaveProperty("N");
  });

  test.fixme("URL ?result=mbti:INTJ 显示分享 banner", async ({ page }) => {
    await page.goto("/?result=mbti:INTJ");
    const banner = page.locator(".shared-result-banner");
    await expect(banner).toBeVisible({ timeout: 5000 });
    await expect(banner).toContainText("INTJ");
  });

  test("URL ?result=bfi10:O72-C58-E33-A65-N42 显示分享 banner", async ({ page }) => {
    await page.goto("/?result=bfi10:O72-C58-E33-A65-N42", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500); // 等待 React hydrate + banner 渲染
    const banner = page.locator(".shared-result-banner");
    await expect(banner).toBeVisible({ timeout: 5000 });
    await expect(banner).toContainText("主导维度");
  });

  test("QuizHistory section 在有历史时显示", async ({ page }) => {
    // 先预置 localStorage 历史
    await page.goto("/");
    await page.evaluate(() => {
      const entry = {
        id: "test-123",
        type: "mbti",
        completedAt: Date.now(),
        result: { code: "INFP", scores: { EI: 70, SN: 65, TF: 80, JP: 60 } },
      };
      window.localStorage.setItem("mindnest_quiz_history", JSON.stringify([entry]));
    });
    await page.goto("/");
    const section = page.locator("#quiz-history");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    await expect(section).toContainText("MBTI");
    await expect(section).toContainText("INFP");
  });
});
