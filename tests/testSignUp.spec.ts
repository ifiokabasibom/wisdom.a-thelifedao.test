import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.setTimeout(180000);

// Utility function to generate a random email
function generateRandomEmail() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `ifiokabasibom+${randomNumber}@gmail.com`;
}



test.describe('Sign-Up Tests', () => {
  // Clear cookies and permissions before each test
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.context().clearPermissions();
  });

  // Test data
  const email = process.env.RANDOM_TEST_USER || generateRandomEmail();
  const password = process.env.TEST_PASSWORD || 'Password123@';

  // Load coupon codes
  const couponFilePath = path.resolve(__dirname, 'coupons.json');
  if (!fs.existsSync(couponFilePath)) {
    throw new Error('Missing coupons.json file');
  }
  const data = JSON.parse(fs.readFileSync(couponFilePath, 'utf-8'));
  if (!data.codes || data.codes.length === 0) {
    throw new Error('No coupons left in coupons.json');
  }
  const validCoupon = data.codes.pop();
  fs.writeFileSync(couponFilePath, JSON.stringify({ codes: data.codes }, null, 2), 'utf-8');
  console.log('Using coupon:', validCoupon);

  //|=========================NOTE TO ASSESSMENT REVIEWER=========================|
  //Coupon codes that are guaranteed to work, incase the ones in the JSON file get exhausted in testing
  // Define the (backup) array type — an array of strings
    // const backupCouponCodes: string[] = [
    //     "2JKfKt",
    //     "wGVRC7",
    //     "jakZcp",
    //     "PynEe8",
    //     "VgkEVp"
    // ];

    // // Pop the last coupon code and store it in a variable
    // const backupValidCoupon: string | undefined = backupCouponCodes.pop();

  test('Happy Path Signup Flow', async ({ page }) => {
        // Navigate to landing page
        await page.goto('https://uat.thelifedao.io/en', { waitUntil: 'domcontentloaded' });

        // Close modal if present
        const closeBtn = page.getByRole('button', { name: 'Close' });
        try {
            await closeBtn.waitFor({ state: 'visible', timeout: 15000 });
            await closeBtn.click();
        } catch {
            console.log('Close button not present, continuing...');
        }

        // Click Join via Invite
        const joinBtn = page.getByRole('button', { name: 'Join via Invite' });
        await expect(joinBtn).toBeVisible({ timeout: 15000 });
        await joinBtn.click();

        // Wait a few seconds for SPA routing
        await page.waitForTimeout(3000);

        // Locate invite code input
        let inviteInput = page.getByRole('textbox', { name: /invite code/i });

        // If it’s not visible yet, force navigation
        try {
            await inviteInput.waitFor({ state: 'visible', timeout: 5000 });
        } catch {
            console.log('Invite input not found, navigating directly to signup page...');
            await page.goto('https://uat.thelifedao.io/app/sign-up?lang=en', { waitUntil: 'domcontentloaded' });
            inviteInput = page.getByRole('textbox', { name: /invite code/i });
            await inviteInput.waitFor({ state: 'visible', timeout: 15000 });
        }

        // Fill the invite code
        await inviteInput.fill(validCoupon);

        // Submit coupon
        const submitBtn = page.getByRole('button', { name: /submit/i });
        await expect(submitBtn).toBeVisible({ timeout: 15000 });
        await submitBtn.click();

        // Fill email/password
        const emailInput = page.getByRole('textbox', { name: 'Enter your email' });
        await expect(emailInput).toBeVisible({ timeout: 15000 });
        await emailInput.fill(email);

        const passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
        await expect(passwordInput).toBeVisible({ timeout: 15000 });
        await passwordInput.fill(password);

        const repeatPasswordInput = page.getByRole('textbox', { name: 'Repeat Password' });
        await expect(repeatPasswordInput).toBeVisible({ timeout: 15000 });
        await repeatPasswordInput.fill(password);

        // Click Sign Up
        const signUpBtn = page.getByRole('button', { name: 'Sign Up' });
        await expect(signUpBtn).toBeVisible({ timeout: 15000 });
        await signUpBtn.click();

        // Confirm successful signup
        const confirmationText = page.getByText("You're Almost Ready to Go!");
        await expect(confirmationText).toBeVisible({ timeout: 20000 });

        console.log(`Signup successful for ${email} using coupon ${validCoupon}`);
    });
});
