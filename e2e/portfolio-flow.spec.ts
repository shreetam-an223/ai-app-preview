import { test, expect } from "@playwright/test";

test.describe("Primary Flow E2E (FE-09)", () => {
  test("loads homepage, navigates to micro-interactions, and verifies button", async ({ page }) => {
    // 1. Visit Home
    await page.goto("/");
    await expect(page).toHaveTitle(/AI Production Preview|Shreetam/i);

    // 2. Check heading visibility
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();

    // 3. Navigate to Buttons route
    await page.goto("/buttons");
    await expect(page.locator("h1")).toContainText("Buttons with a Brain");

    // 4. Verify primary button action
    const deployBtn = page.getByRole("button", { name: /deploy model/i });
    await expect(deployBtn).toBeVisible();
    await deployBtn.click();

    // 5. Verify dynamic loading transition
    await expect(page.getByRole("button", { name: /deploying/i })).toBeVisible();
  });
});