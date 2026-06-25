import { expect, test } from "@playwright/test";

test("orders two dishes and confirms today's menu", async ({ page }) => {
  await page.goto("/family/home");

  await page.getByRole("button", { name: "午餐" }).click();
  await page.getByRole("button", { name: "荤菜" }).click();
  await page.getByRole("button", { name: /红烧肉/ }).click();
  await page.getByRole("button", { name: "素菜" }).click();
  await page.getByRole("button", { name: /清炒时蔬/ }).click();
  await page.getByRole("button", { name: /查看餐桌/ }).click();

  await expect(page.getByText("1. 红烧肉")).toBeVisible();
  await expect(page.getByText("2. 清炒时蔬")).toBeVisible();

  await page.getByRole("button", { name: "确认菜单" }).click();
  await page.getByRole("button", { name: "确认生成" }).click();

  await expect(page.getByRole("heading", { name: "今日午餐" })).toBeVisible();
  await expect(page.getByText("红烧肉").first()).toBeVisible();
  await expect(page.getByText("清炒时蔬").first()).toBeVisible();
});
