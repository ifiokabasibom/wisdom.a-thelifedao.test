import { test, expect } from '@playwright/test';
//import { v4 as uuidv4 } from 'uuid';

test.describe('Sign up tests', () => {
  // const password = process.env.TEST_PASSWORD || 'TestP@ssw0rd!';
  // const inviteCode = process.env.INVITE_CODE || '';

  // test.only('Sign up - happy path (with valid invite code)', async ({ page }) => {
  //   await page.goto('https://uat.thelifedao.io');
  //   await page.getByRole('button', { name: 'Close' }).click();
  //   await page.getByRole('button', { name: 'Join via Invite' }).click();
  //   await page.goto('https://uat.thelifedao.io/app/sign-up?lang=en');
  //   await page.getByRole('textbox', { name: 'Invite code/link' }).click();
  //   //Use a Valid $25 Coupon that is active to fill the input field
  //   await page.getByRole('textbox', { name: 'Invite code/link' }).fill('VgkEVp');
  //   await page.getByRole('button', { name: 'Submit' }).click();
  //   const errorMessage1 = page.locator('text=Invite code is invalid, >> text=Invite code');
  //   await expect(errorMessage1).toBeVisible();

    
    // NOTE: Update the selectors below to match UAT DOM
    // await page.click('text=Sign up');
    // const email = `automation+${Date.now()}@example.com`;
    // await page.fill('input[name="email"], input[type="email"]', email);
    // await page.fill('input[name="password"]', password);
    // await page.fill('input[name="confirmPassword"], input[name="confirm_password"]', password);
    // if (inviteCode) {
    //   await page.fill('input[name="inviteCode"], input[placeholder="Invite code"]', inviteCode);
    // }
    // await page.click('button:has-text("Create account"), button:has-text("Sign up")');

    // // Expect a welcome or dashboard text - update to actual UI text
    // await expect(page.locator('text=Welcome,')).toBeVisible({ timeout: 15000 }).catch(async () => {
    //   // fallback: check for dashboard element
    //   await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 15000 });
    // });
  });

  test.only('Sign up - wrong coupon shows validation error', async ({ page }) => {
    await page.goto('https://uat.thelifedao.io/en');
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Join via Invite' }).click();
    await page.goto('https://uat.thelifedao.io/app/sign-up?lang=en');
    await page.getByRole('textbox', { name: 'Invite code/link' }).click();
    //Use a Coupon that is not $25 and Active to fill the input field
    await page.getByRole('textbox', { name: 'Invite code/link' }).fill('VgkEVp');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill('ifiokabasibom+03@gmail.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).click();
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Password123@');
    await page.getByRole('textbox', { name: 'Repeat your password' }).click();
    await page.getByRole('textbox', { name: 'Repeat your password' }).fill('Password123@');
    await page.getByRole('button', { name: 'Sign Up'}).click();
    // const errorMessage = page.getByText('Invite code is invalid');
    // await expect(errorMessage).toBeVisible();
    
    // await page.goto('/');
    // await page.click('text=Sign up');
    // await page.fill('input[name="email"], input[type="email"]', 'invalid-email');
    // await page.fill('input[name="password"]', password);
    // await page.fill('input[name="confirmPassword"], input[name="confirm_password"]', password);
    // await page.click('button:has-text("Create account"), button:has-text("Sign up")');
    // await expect(page.locator('text=Enter a valid email, text=Invalid email')).toBeVisible();
  });

