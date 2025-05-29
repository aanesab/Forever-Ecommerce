const { Builder, By, until } = require("selenium-webdriver");
require("chromedriver");

const runRegisterTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    const randomEmail = `user${Date.now()}@test.com`;
    await driver.get("http://localhost:3000/login");

    const createAccountButton = await driver.findElement(By.xpath("//p[text()='Create account']"));
    await createAccountButton.click();

    await driver.wait(until.elementLocated(By.css("input[placeholder='Name']")), 5000);
    await driver.findElement(By.css("input[placeholder='Name']")).sendKeys("Test User");

    await driver.findElement(By.css("input[type='email']")).sendKeys(randomEmail);
    await driver.findElement(By.css("input[type='password']")).sendKeys("testpassword123");
    await driver.findElement(By.css("button")).click();

    await driver.wait(until.urlIs("http://localhost:3000/"), 5000);
    console.log("Register Test completed.");
  } catch (err) {
    console.error("Register Test failed:", err.message);
  } finally {
    await driver.quit();
  }
};

runRegisterTest();
