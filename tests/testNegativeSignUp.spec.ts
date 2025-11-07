import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.setTimeout(120000);


test.describe('Sign-Up Tests', () => {

    const wrongEmail = process.env.WRONG_TEST_USER || 'wrong.password@gmail.com';
    const wrongPassword = process.env.WRONG_PASSWORD || 'wrongPassword123@';

    
    test.only('Sign up - wrong coupon shows validation error', async ({ page }) => {
        await page.goto('https://uat.thelifedao.io/en');
        //await page.getByRole('button', { name: 'Close' }).click();

        //The close button often takes too long to load, so we're handling a graceful failure here
        const closeBtn = page.getByRole('button', { name: 'Close' });

        try {
        // Wait up to 15 seconds for the "Close" button to appear
        await closeBtn.waitFor({ state: 'visible', timeout: 15000 });
        await closeBtn.click();
        console.log('Close button found and clicked successfully');
        } catch (err) {
        console.error('Close button took too long to load — terminating test');
        await page.screenshot({ path: 'test-results/close-button-error.png', fullPage: true});
        throw new Error('Test terminated: Close button took too long');
        }

        await page.getByRole('button', { name: 'Join via Invite' }).click();
        await page.getByRole('textbox', { name: 'Invite code/link' }).click();
        //Use a Coupon that is NOT $25 and Active to fill the input field
        await page.getByRole('textbox', { name: 'Invite code/link' }).fill('VgkEVp');
        await page.getByRole('button', { name: 'Submit' }).click();
        const errorMessage = page.getByText('Invite code is invalid');
        await expect(errorMessage).toBeVisible();
        
    });
});  
