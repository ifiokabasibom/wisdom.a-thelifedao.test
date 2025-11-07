import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.setTimeout(120000);

//Utility function to help generate random 4-Digit number between 1000 and 9999 for now
function generateRandomEmail(){
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `ifiokabasibom+${randomNumber}@gmail.com`;
}


test.describe('Sign-Up Tests', () => {
    //Utilize the generateRandomEmail function to create a new email on each run
    const email = process.env.RANDOM_TEST_USER || generateRandomEmail();
    const password = process.env.TEST_PASSWORD || 'Password123@';
    const wrongEmail = process.env.WRONG_TEST_USER || 'wrong.password@gmail.com';
    const wrongPassword = process.env.WRONG_PASSWORD || 'wrongPassword123@';

    //Use this if you're not popping from the array
    const staticValidCoupon = process.env.VALID_COUPON || '4Ejnej';

    //Coupon codes extracted from the spreadsheet

    //const couponFilePath = './coupons.json';
    const couponFilePath = path.resolve(__dirname, 'coupons.json');

    //Load coupons from the json file or fallback to array if the json file is not present
    let couponArray: string[] = [];
    console.log('Looking for coupons file at:', couponFilePath);
    console.log('Current working directory:', process.cwd());
    if(fs.existsSync(couponFilePath)){
        const data = JSON.parse(fs.readFileSync(couponFilePath, 'utf-8'));
        couponArray = data.codes;

    } else {
        //missing coupon file handled
        console.error('coupons.json not found... You need a coupons json file in the same folder');
        throw new Error('Missing coupons.json file');
    }

    //Pop a coupon from the json file, save it in a variable to be used in the script
    let validCoupon: string;
    try{
        if (couponArray.length === 0){
            throw new Error('No coupons left - manually set the coupon code');
        }
        //Pop one coupon for this run
        validCoupon = couponArray.pop() as string;
        console.log('Using coupon ', validCoupon);

         // Write updated array back to JSON file 
        fs.writeFileSync(
            couponFilePath,
            JSON.stringify({ codes: couponArray }, null, 2),
                'utf-8'
        );

    }catch (err){
        console.error(`${err instanceof Error ? err.message : err}`);
        throw err;
    }


    test.only('Test Happy Path Signup Flow', async ({ page }) => {
        page.setDefaultTimeout(60000);
        await page.goto('https://uat.thelifedao.io/en');
        await page.getByRole('button', { name: 'Close' }).click();
        await page.getByRole('button', { name: 'Join via Invite' }).click();
        await page.goto('https://uat.thelifedao.io/app/sign-up?lang=en');
        await page.getByRole('textbox', { name: 'Invite code/link' }).click();
        
        //Use a Coupon that is $25 and Active to fill the input field
        await page.getByRole('textbox', { name: 'Invite code/link' }).fill(validCoupon);
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.waitForTimeout(5000);
        await page.getByRole('textbox', { name: 'Enter your email' }).click();

        await page.getByRole('textbox', { name: 'Enter your email' }).fill(email);
        await page.getByRole('textbox', { name: 'Enter your password' }).click();
        await page.getByRole('textbox', { name: 'Enter your password' }).fill(password);
        await page.getByRole('textbox', { name: 'Repeat Password' }).click();
        await page.getByRole('textbox', { name: 'Repeat Password' }).fill(password);
        await page.getByRole('button', { name: 'Sign Up' }).click();
    });

    test('Sign up - wrong coupon shows validation error', async ({ page }) => {
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
