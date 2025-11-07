import { test, expect } from '@playwright/test';
test.setTimeout(90000);

//Utility function to help generate random 4-Digit number between 1000 and 9999 for now
function generateRandomEmail(){
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return 'ifiokabasibom+${randomNumber}@gmail.com';
}

test.describe('Sign-Up Tests', () => {
    //Utilize the generateRandomEmail function to create a new email on each run
    const email = process.env.EXISTING_TEST_USER || generateRandomEmail();
    const password = process.env.TEST_PASSWORD || 'Password123@';
    const wrongEmail = process.env.EXISTING_TEST_USER || 'wrong.password@gmail.com';
    const wrongPassword = process.env.TEST_PASSWORD || 'wrongPassword123@';

    test('Test Happy Path Signup Flow', async ({ page }) => {
        page.setDefaultTimeout(60000);
        await page.goto('https://uat.thelifedao.io/en');
        await page.getByRole('button', { name: 'Close' }).click();
        await page.getByRole('button', { name: 'Join via Invite' }).click();
        //await page.goto('https://uat.thelifedao.io/app/sign-up?lang=en');
        await page.getByRole('textbox', { name: 'Invite code/link' }).click();
        //Use a Coupon that is $25 and Active to fill the input field
        await page.getByRole('textbox', { name: 'Invite code/link' }).fill('exmg9E');
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.waitForTimeout(5000);
        await page.getByRole('textbox', { name: 'Enter your email' }).click();

        
        await page.getByRole('textbox', { name: 'Enter your email' }).fill('ifiokabasibom+03@gmail.com');
        await page.getByRole('textbox', { name: 'Enter your password' }).click();
        await page.getByRole('textbox', { name: 'Enter your password' }).fill('Password123@');
        await page.getByRole('textbox', { name: 'Repeat Password' }).click();
        await page.getByRole('textbox', { name: 'Repeat Password' }).fill('Password123@');
        await page.getByRole('button', { name: 'Sign Up' }).click();
    });

    test.only('Sign up - wrong coupon shows validation error', async ({ page }) => {
        await page.goto('https://uat.thelifedao.io/en');
        await page.getByRole('button', { name: 'Close' }).click();
        await page.getByRole('button', { name: 'Join via Invite' }).click();
        await page.goto('https://uat.thelifedao.io/app/sign-up?lang=en');
        await page.getByRole('textbox', { name: 'Invite code/link' }).click();
        //Use a Coupon that is NOT $25 and Active to fill the input field
        await page.getByRole('textbox', { name: 'Invite code/link' }).fill('VgkEVp');
        await page.getByRole('button', { name: 'Submit' }).click();
        const errorMessage = page.getByText('Invite code is invalid');
        await expect(errorMessage).toBeVisible();
        
    });
});  
