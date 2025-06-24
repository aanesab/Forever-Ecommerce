import { Builder, By, until } from "selenium-webdriver";
import "chromedriver";

const runRegisterTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    const randomEmail = `user${Date.now()}@test.com`;
    await driver.get("http://localhost:5173/login"); // ndrysho në 3000 nëse përdor Next.js

    const createAccountButton = await driver.findElement(By.xpath("//p[text()='Create account']"));
    await createAccountButton.click();

    await driver.wait(until.elementLocated(By.css("input[placeholder='Name']")), 5000);
    await driver.findElement(By.css("input[placeholder='Name']")).sendKeys("Test User");
    await driver.findElement(By.css("input[type='email']")).sendKeys(randomEmail);
    await driver.findElement(By.css("input[type='password']")).sendKeys("testpassword123");

    await driver.findElement(By.css("button")).click();

    await driver.wait(until.urlIs("http://localhost:5173/"), 5000); 
    console.log("Register Test completed.");
  } catch (err) {
    console.error("Register Test failed:", err.message);
  } finally {
    await driver.quit();
  }
};

runRegisterTest();
