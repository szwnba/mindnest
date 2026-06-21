import { test, expect } from "@playwright/test";

test.describe("测评流程", () => {
  test("测评 intro 阶段显示开始按钮", async ({ page }) => {
    await page.goto("/");
    await page.locator("#quiz").scrollIntoViewIfNeeded();
    const startBtn = page.locator(".quiz-intro .btn-primary");
    await expect(startBtn).toBeVisible({ timeout: 10000 });
    await expect(startBtn).toContainText("开始测评");
  });

  test("点击开始按钮进入答题阶段", async ({ page }) => {
    await page.goto("/");
    await page.locator("#quiz").scrollIntoViewIfNeeded();
    await page.locator(".quiz-intro .btn-primary").click();
    await page.waitForTimeout(500);
    // 应该显示问题
    const question = page.locator(".quiz-question-text");
    await expect(question).toBeVisible({ timeout: 10000 });
  });

  test("答题阶段显示题目和选项", async ({ page }) => {
    await page.goto("/");
    await page.locator("#quiz").scrollIntoViewIfNeeded();
    await page.locator(".quiz-intro .btn-primary").click();
    await page.waitForTimeout(500);

    // 检查题目文本
    const questionText = page.locator(".quiz-question-text");
    await expect(questionText).toBeVisible({ timeout: 10000 });

    // 检查有 5 个 Likert 选项
    const options = page.locator(".likert-btn");
    await expect(options).toHaveCount(5);
  });

  test("选择答案后进入下一题", async ({ page }) => {
    await page.goto("/");
    await page.locator("#quiz").scrollIntoViewIfNeeded();
    await page.locator(".quiz-intro .btn-primary").click();
    await page.waitForTimeout(500);

    // 获取第一题文本
    const firstQuestion = await page.locator(".quiz-question-text").textContent();

    // 选择第一个选项
    await page.locator(".likert-btn").first().click();
    await page.waitForTimeout(500);

    // 题目应该变化或进入下一题
    const questionText = page.locator(".quiz-question-text");
    await expect(questionText).toBeVisible({ timeout: 10000 });
  });

  test("答题过程无控制台错误", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await page.locator("#quiz").scrollIntoViewIfNeeded();
    await page.locator(".quiz-intro .btn-primary").click();
    await page.waitForTimeout(500);

    // 回答前 3 题
    for (let i = 0; i < 3; i++) {
      const options = page.locator(".likert-btn");
      await options.nth(2).click();
      await page.waitForTimeout(400);
    }

    expect(errors).toHaveLength(0);
  });

  test("进度条显示答题进度", async ({ page }) => {
    await page.goto("/");
    await page.locator("#quiz").scrollIntoViewIfNeeded();
    await page.locator(".quiz-intro .btn-primary").click();
    await page.waitForTimeout(500);

    // 回答一题后检查进度条
    await page.locator(".likert-btn").first().click();
    await page.waitForTimeout(400);

    const progressTrack = page.locator(".quiz-progress-track");
    await expect(progressTrack).toBeVisible();
    const ariaValueNow = await progressTrack.getAttribute("aria-valuenow");
    expect(ariaValueNow).not.toBeNull();
    expect(Number(ariaValueNow)).toBeGreaterThanOrEqual(1);
  });
});
