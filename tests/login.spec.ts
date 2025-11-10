import { test, expect } from '@playwright/test';
test.setTimeout(90000);

test.describe('Login tests', () => {
  const email = process.env.EXISTING_TEST_USER || 'ifiokabasibom+03@gmail.com';
  const password = process.env.TEST_PASSWORD || 'Password123@';
  const wrongEmail = process.env.EXISTING_TEST_USER || 'wrong.password@gmail.com';
  const wrongPassword = process.env.TEST_PASSWORD || 'wrongPassword123@';

  test('Login - valid credentials', async ({ page }) => {
    await page.goto('https://uat.thelifedao.io/en');
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.goto('https://uat.thelifedao.io/app/sign-in?lang=en');

    //Using valid credentials
    await page.getByRole('textbox', { name: 'Enter your email' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(email);
    await page.getByRole('textbox', { name: 'Enter your password' }).click();
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(password);

    //To Check 'Remember Me', uncomment the line below
    //await page.getByRole('img').nth(4).click();

    await page.locator('form').getByRole('button', { name: 'Log In' }).click();

    const confirmationText = page.getByText('Dashboard');
    await expect(confirmationText).toBeVisible();

  });

  test('Login - invalid password shows error', async ({ page }) => {
    await page.goto('https://uat.thelifedao.io/en');
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.goto('https://uat.thelifedao.io/app/sign-in?lang=en');

    //Using INVALID credentials
    await page.getByRole('textbox', { name: 'Enter your email' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(wrongEmail);
    await page.getByRole('textbox', { name: 'Enter your password' }).click();
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(wrongPassword);
    
    //To Check 'Remember Me', uncomment the line below 
    //await page.getByRole('img').nth(4).click();

    await page.locator('form').getByRole('button', { name: 'Log In' }).click();

    const invalidUserText = page.getByText('Invalid email or password');
    await expect(invalidUserText).toBeVisible();
  });
});
