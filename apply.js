const puppeteer = require('puppeteer');

const login = 'https://internshala.com/login';
const email = '20410130773.sabyasachimishra@gmail.com';
const password = 'sabyasachi2002';
const searchKeyword = 'Web Development'; // Change this to your preferred search keyword
const applicationMessage = 'Your application message here'; // Customize your application message

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    await page.goto(login);

    // Log in
    await page.type("input[name='email']", email, { delay: 50 });
    await page.type("input[type='password']", password, { delay: 50 });
    await page.click("button[class='btn btn-primary']", { delay: 50 });

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Go to internships page and search
    await page.goto('https://internshala.com/internships', { waitUntil: 'networkidle2' });
    await page.type("input[id='keywords']", searchKeyword, { delay: 50 });
    await page.click("button[id='search']", { delay: 50 });

    await page.waitForSelector('.internship_meta', { waitUntil: 'networkidle2' });

    // Apply for the top 10 internships
    for (let i = 0; i < 10; i++) {
        try {
            const internships = await page.$$('.internship_meta');

            if (internships[i]) {
                const applyButton = await internships[i].$eval("a[href]", btn => btn.href);
                if (applyButton) {
                    await page.goto(applyButton, { waitUntil: 'networkidle2' });

                    // Check if the "Apply Now" button exists
                    const applyNowButton = await page.$("button.btn-primary");
                    if (applyNowButton) {
                        // Click on 'Apply Now' button
                        await applyNowButton.click({ delay: 50 });

                        await page.waitForSelector("textarea[name='internship_application[cover_letter]']", { waitUntil: 'networkidle2' });

                        // Enter application message
                        await page.type("textarea[name='internship_application[cover_letter]']", applicationMessage, { delay: 50 });

                        // Submit the application
                        await page.click("button[type='submit']", { delay: 50 });

                        await page.waitForNavigation({ waitUntil: 'networkidle2' });

                        // Navigate back to the internships list
                        await page.goto('https://internshala.com/internships', { waitUntil: 'networkidle2' });
                        await page.type("input[id='keywords']", searchKeyword, { delay: 50 });
                        await page.click("button[id='search']", { delay: 50 });
                        await page.waitForSelector(".internship_meta", { waitUntil: 'networkidle2' });
                    } else {
                        console.error(`Apply Now button not found for internship ${i + 1}`);
                    }
                } else {
                    console.error(`Apply button not found for internship ${i + 1}`);
                }
            }
        } catch (error) {
            console.error(`Error applying for internship ${i + 1}:`, error);
        }
    }

    console.log('Applied to top 10 internships successfully!');
    await browser.close();
})();