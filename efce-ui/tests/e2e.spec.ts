import { test, expect } from "@playwright/test";

test("command palette navigation", async ({ page }) => {
  await page.goto("/dashboard");
  await page.keyboard.press("Control+K");
  await expect(page.getByTestId("command-palette")).toBeVisible();

  const input = page.getByTestId("command-palette-input");
  await input.fill("Reports");
  await input.press("Enter");

  await expect(page).toHaveURL(/\/dashboard\/reports/);
});

test("reports filter and search", async ({ page }) => {
  await page.goto("/dashboard/reports");
  await page.getByTestId("reports-search").fill("Incident");
  await page.getByTestId("reports-filter").selectOption("Incident");

  await expect(page.getByTestId("report-item-RPT-001")).toBeVisible();
  await expect(page.getByTestId("report-item-RPT-002")).toHaveCount(0);
});

test("export PDF triggers download", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/dashboard/incidents/INC-001");

  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("export-pdf").click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
});

test("graph interactions add node", async ({ page }) => {
  await page.goto("/dashboard/graph-studio");
  await page.getByTestId("graph-new-node-input").fill("Node A");
  await page.getByTestId("graph-add-node").click();

  await expect(page.getByText("Node A")).toBeVisible();
});

test("risk drawer opens and closes", async ({ page }) => {
  await page.goto("/dashboard/risk-registry");
  await page.getByTestId("risk-row-RISK-01").click();

  await expect(page.getByTestId("risk-drawer")).toBeVisible();
  await page.getByTestId("risk-drawer-close").click();
  await expect(page.getByTestId("risk-drawer")).toHaveCount(0);
});

test("theme persists across reload", async ({ page }) => {
  await page.goto("/dashboard");
  const toggle = page.getByRole("switch", { name: "Toggle dark mode" });
  await toggle.click();

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
