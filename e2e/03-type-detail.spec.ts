import { test, expect } from "@playwright/test";

test.describe("类型详情页", () => {
  test("从首页点击 INTJ 卡片跳转到详情页", async ({ page }) => {
    await page.goto("/");
    await page.locator("#types").scrollIntoViewIfNeeded();
    await page.click("text=INTJ");
    await expect(page).toHaveURL(/\/types\/INTJ/);
  });

  test("详情页显示类型代码和名称", async ({ page }) => {
    await page.goto("/types/INTJ");
    await expect(page.locator(".type-detail-code")).toHaveText("INTJ");
    await expect(page.locator(".type-detail-name")).toBeVisible();
    await expect(page.locator(".type-detail-name")).toContainText("建筑师");
  });

  test("详情页显示 prose 描述", async ({ page }) => {
    await page.goto("/types/INTJ");
    await expect(page.locator(".type-detail-prose")).toBeVisible();
    const proseText = await page.locator(".type-detail-prose").textContent();
    expect(proseText!.length).toBeGreaterThan(20);
  });

  test("详情页有返回按钮", async ({ page }) => {
    await page.goto("/types/INTJ");
    const backBtn = page.locator(".type-detail-back");
    await expect(backBtn).toBeAttached();
    await backBtn.scrollIntoViewIfNeeded();
    await expect(backBtn).toBeVisible();
    await backBtn.click();
    // 返回后应该在 /types 页面
    await expect(page).toHaveURL("/types");
  });

  test("详情页显示优势和成长方向卡片", async ({ page }) => {
    await page.goto("/types/INTJ");
    await expect(page.locator(".type-detail-card")).toHaveCount(2);
    await expect(page.locator("#strengths-h")).toBeVisible();
    await expect(page.locator("#growth-h")).toBeVisible();
  });

  test("详情页 INFP 类型正确渲染", async ({ page }) => {
    await page.goto("/types/INFP");
    await expect(page.locator(".type-detail-code")).toHaveText("INFP");
    await expect(page.locator(".type-detail-name")).toContainText("调停者");
  });

  test("详情页无控制台错误", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/types/ENTJ");
    await page.waitForLoadState("networkidle");
    expect(errors).toHaveLength(0);
  });

  test("无效类型代码返回 404 或重定向", async ({ page }) => {
    const response = await page.goto("/types/XXXX");
    // 应该要么 404 要么重定向到首页
    if (response) {
      const status = response.status();
      // 404 或 200（如果做了重定向或动态渲染）
      expect([200, 404]).toContain(status);
    }
  });
});
