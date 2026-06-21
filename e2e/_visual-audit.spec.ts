import { test } from "@playwright/test";

test("visual audit screenshots", async ({ page }) => {
  test.setTimeout(120000);
  const pages = [
    { name: "01-home-full", url: "/" },
    { name: "02-types", url: "/types" },
    { name: "03-types-INTJ", url: "/types/INTJ" },
    { name: "04-about", url: "/about" },
  ];
  for (const p of pages) {
    await page.goto(p.url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `/tmp/visual-audit/${p.name}.png`,
      fullPage: true,
    });
  }
  // Above-fold home for first impression
  await page.goto("/", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({
    path: "/tmp/visual-audit/00-home-above-fold-desktop.png",
    fullPage: false,
  });
});
