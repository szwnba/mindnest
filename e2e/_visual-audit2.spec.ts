import { test } from "@playwright/test";

test("scroll-aware screenshots", async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle", timeout: 30000 });
  // Force reveal: scroll all the way down then up to trigger IntersectionObserver
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let y = 0;
      const step = () => {
        window.scrollTo(0, y);
        y += 500;
        if (y < document.body.scrollHeight) {
          setTimeout(step, 100);
        } else {
          window.scrollTo(0, 0);
          setTimeout(resolve, 500);
        }
      };
      step();
    });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: "/tmp/visual-audit/05-home-full-revealed.png",
    fullPage: true,
  });
});
