import { test } from "@playwright/test";

test("force-reveal full page", async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle", timeout: 30000 });
  // Force ALL reveal elements visible immediately (bypass IntersectionObserver)
  await page.addStyleTag({
    content: `.reveal, [class*="reveal"] { opacity: 1 !important; transform: none !important; }`,
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: "/tmp/visual-audit/AFTER-06-forced-reveal.png",
    fullPage: true,
  });
});
