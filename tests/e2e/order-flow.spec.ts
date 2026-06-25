import { expect, test } from "@playwright/test";

test("orders two dishes and confirms today's menu", async ({ page }) => {
  await page.goto("/family/home");

  await page.getByRole("button", { name: "午餐" }).click();
  await page.getByRole("button", { name: "主菜" }).click();
  await page.getByRole("button", { name: /西红柿炖牛腩/ }).click();
  await page.getByRole("button", { name: "凉菜" }).click();
  await page.getByRole("button", { name: /凉拌青瓜/ }).click();
  await page.getByRole("button", { name: /查看餐桌/ }).click();

  await expect(page.getByText("1. 西红柿炖牛腩")).toBeVisible();
  await expect(page.getByText("2. 凉拌青瓜")).toBeVisible();

  await page.getByRole("button", { name: "确认菜单" }).click();
  await page.getByRole("button", { name: "确认生成" }).click();

  await expect(page.getByRole("heading", { name: "今日午餐" })).toBeVisible();
  await expect(page.getByText("西红柿炖牛腩").first()).toBeVisible();
  await expect(page.getByText("凉拌青瓜").first()).toBeVisible();
});
